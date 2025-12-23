# slide_to_html.py 模块说明文档

## 文件位置
`servers/fastapi/api/v1/ppt/endpoints/slide_to_html.py`

## 模块概述

该模块提供了将 PowerPoint 幻灯片转换为 HTML/React 组件的 API 端点，以及模板布局管理功能。支持 OpenAI 官方 API 和自定义 LLM 代理（OpenAI 兼容接口）。

---

## 主要功能

### 1. 幻灯片转 HTML (`/slide-to-html`)
将幻灯片图片和 OXML 数据转换为 HTML 代码。

**请求参数：**
- `image`: 图片路径（如 `/app_data/images/uuid/slide_1.png`）
- `xml`: OXML 内容文本
- `fonts`: 可选的字体列表

**响应：**
- `success`: 是否成功
- `html`: 生成的 HTML 代码

### 2. HTML 转 React 组件 (`/html-to-react`)
将 HTML 内容转换为 TSX React 组件代码。

**请求参数：**
- `html`: 要转换的 HTML 内容
- `image`: 可选的图片路径（提供视觉上下文）

**响应：**
- `success`: 是否成功
- `react_component`: 生成的 React 组件代码

### 3. HTML 编辑 (`/html-edit`)
基于图片和文本提示编辑现有 HTML 内容。

**请求参数（Form Data）：**
- `current_ui_image`: 当前 UI 图片文件
- `sketch_image`: 可选的草图/指示图片
- `html`: 当前 HTML 内容
- `prompt`: 描述变更的文本提示

**响应：**
- `success`: 是否成功
- `edited_html`: 编辑后的 HTML

### 4. 模板管理 (`/template-management`)
- `POST /save-templates`: 保存布局模板
- `GET /get-templates/{presentation}`: 获取指定演示文稿的布局
- `GET /summary`: 获取所有演示文稿摘要
- `POST /templates`: 创建/更新模板元数据
- `DELETE /delete-templates/{template_id}`: 删除模板

---

## 修改记录

### 支持自定义 LLM 代理

为了支持使用自定义的 OpenAI 兼容 LLM 代理（如 `api.openai-proxy.org`），对原有代码进行了以下修改：

#### 1. 新增 LLM 配置函数

```python
def get_llm_config() -> Tuple[str, Optional[str], str]:
    """
    获取 LLM 配置，支持 openai 和 custom 模式
    返回: (api_key, base_url, model)
    """
    llm_provider = os.getenv("LLM", "openai").lower()
    
    if llm_provider == "custom":
        api_key = os.getenv("CUSTOM_LLM_API_KEY")
        base_url = os.getenv("CUSTOM_LLM_URL")
        model = os.getenv("CUSTOM_MODEL", "gpt-4o")
        # ...
    else:
        api_key = os.getenv("OPENAI_API_KEY")
        model = os.getenv("OPENAI_MODEL", "gpt-4o")
        # ...
```

#### 2. 修改 API 调用方式

**原代码** 使用 OpenAI Responses API（GPT-5 专用）：
```python
client = OpenAI(api_key=api_key)
response = client.responses.create(
    model="gpt-5",
    input=input_payload,
    reasoning={"effort": "high"},
)
```

**修改后** 使用标准 Chat Completions API（兼容大多数 LLM 代理）：
```python
client_kwargs = {"api_key": api_key}
if base_url:
    client_kwargs["base_url"] = base_url
client = OpenAI(**client_kwargs)

response = client.chat.completions.create(
    model=model,
    messages=messages,
    max_tokens=16000,
)
```

#### 3. 修改的函数列表

| 函数名 | 修改内容 |
|--------|----------|
| `generate_html_from_slide()` | 添加 `base_url`、`model` 参数，改用 Chat Completions API |
| `generate_react_component_from_html()` | 添加 `base_url`、`model` 参数，改用 Chat Completions API |
| `edit_html_with_images()` | 添加 `base_url`、`model` 参数，改用 Chat Completions API |
| `convert_slide_to_html()` | 使用 `get_llm_config()` 获取配置 |
| `convert_html_to_react()` | 使用 `get_llm_config()` 获取配置 |
| `edit_html_with_images_endpoint()` | 使用 `get_llm_config()` 获取配置 |

#### 4. 消息格式变更

**原格式**（Responses API 专用）：
```python
{"type": "input_image", "image_url": data_url}
{"type": "input_text", "text": user_text}
```

**修改后**（Chat Completions API 标准格式）：
```python
{"type": "image_url", "image_url": {"url": data_url}}
{"type": "text", "text": user_text}
```

---

## 环境变量配置

### OpenAI 模式（默认）

```env
LLM=openai
OPENAI_API_KEY=sk-your-api-key
OPENAI_MODEL=gpt-4o  # 可选，默认 gpt-4o
```

### 自定义 LLM 代理模式

```env
LLM=custom
CUSTOM_LLM_URL=https://api.openai-proxy.org/v1
CUSTOM_LLM_API_KEY=sk-your-proxy-api-key
CUSTOM_MODEL=gpt-4o  # 可选，默认 gpt-4o
```

---

## 依赖项

- `fastapi`: Web 框架
- `openai`: OpenAI Python SDK（用于调用 LLM API）
- `pydantic`: 数据验证
- `sqlalchemy`: 数据库 ORM（异步）

---

## 注意事项

1. **图片路径处理**：支持多种路径格式
   - `/app_data/images/...` - 用户数据目录
   - `/static/...` - 静态文件目录
   - 绝对路径或相对路径

2. **模型兼容性**：使用自定义 LLM 代理时，确保代理支持：
   - Chat Completions API (`/v1/chat/completions`)
   - Vision 能力（图片输入）
   - 足够大的 max_tokens（建议 16000+）

3. **错误处理**：所有 API 端点都包含完整的错误处理，包括：
   - 超时错误 (408)
   - 连接错误 (503)
   - 一般 API 错误 (500)
