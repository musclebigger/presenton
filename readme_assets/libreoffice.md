# LibreOffice 安装指南

Presenton 使用 LibreOffice 将 PPTX 文件转换为 PDF，以便生成幻灯片预览图。以下是各操作系统的安装和配置说明。

## Windows

### 方式一：使用 winget（推荐）

```powershell
winget install LibreOffice.LibreOffice
```

### 方式二：手动安装

1. 访问 [LibreOffice 官网](https://www.libreoffice.org/download/download-libreoffice/)
2. 下载 Windows 版本安装包
3. 运行安装程序，使用默认安装路径：`C:\Program Files\LibreOffice\`

### 验证安装

```powershell
# 检查是否安装成功
& "C:\Program Files\LibreOffice\program\soffice.exe" --version
```

程序会自动检测以下路径：
- `C:\Program Files\LibreOffice\program\soffice.exe`
- `C:\Program Files (x86)\LibreOffice\program\soffice.exe`

---

## macOS

### 方式一：使用 Homebrew（推荐）

```bash
brew install --cask libreoffice
```

### 方式二：手动安装

1. 访问 [LibreOffice 官网](https://www.libreoffice.org/download/download-libreoffice/)
2. 下载 macOS 版本 (.dmg)
3. 打开 DMG 文件，将 LibreOffice 拖入 Applications 文件夹

### 添加到 PATH（如果需要）

```bash
# 添加到 ~/.zshrc 或 ~/.bash_profile
export PATH="/Applications/LibreOffice.app/Contents/MacOS:$PATH"
```

### 验证安装

```bash
libreoffice --version
# 或
/Applications/LibreOffice.app/Contents/MacOS/soffice --version
```

---

## Linux

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install libreoffice
```

### Fedora / RHEL / CentOS

```bash
sudo dnf install libreoffice
```

### Arch Linux

```bash
sudo pacman -S libreoffice-fresh
```

### 验证安装

```bash
libreoffice --version
# 或
which libreoffice
```

---

## Docker 环境

如果使用 Docker 运行 Presenton，LibreOffice 已经包含在 Docker 镜像中，无需额外安装。

```bash
docker-compose up
```

---

## 常见问题

### Q: 程序报错 "系统找不到指定的文件" 或 "libreoffice: command not found"

**A:** LibreOffice 未安装或未添加到系统 PATH。请按照上述步骤安装。

### Q: 转换 PDF 时报错 "LibreOffice PDF conversion timed out"

**A:** 可能是文件过大或系统资源不足。尝试：
1. 关闭其他 LibreOffice 进程
2. 使用更小的 PPTX 文件测试
3. 增加系统内存

### Q: Windows 上安装了 LibreOffice 但仍然报错

**A:** 确保安装路径正确。程序会自动检测以下路径：
- `C:\Program Files\LibreOffice\program\soffice.exe`
- `C:\Program Files (x86)\LibreOffice\program\soffice.exe`

如果安装在其他位置，可以：
1. 将 LibreOffice 的 `program` 目录添加到系统环境变量 PATH
2. 或重新安装到默认路径

### Q: macOS 上提示 "LibreOffice.app is damaged"

**A:** 这是 macOS 的安全限制，运行：

```bash
xattr -cr /Applications/LibreOffice.app
```

---

## 最低版本要求

- LibreOffice 7.0 或更高版本（推荐使用最新稳定版）

---

## 相关链接

- [LibreOffice 官方下载](https://www.libreoffice.org/download/download-libreoffice/)
- [LibreOffice 文档](https://documentation.libreoffice.org/)
