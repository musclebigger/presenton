# User Data Directory Requirements

The `user_data` directory is a critical component for the application's local operation. It serves as the persistent storage for user-specific data, generated content, and temporary processing files.

## Directory Structure

When the application runs, it expects or creates the following structure within the directory specified by `APP_DATA_DIRECTORY` in your `.env` file:

```
user_data/
├── userConfig.json    # Stores user preferences and configuration
├── images/            # Stores uploaded and generated images for presentations
├── exports/           # Destination for exported PDF and PPTX files
└── temp/              # Temporary storage for intermediate processing (e.g., screenshots)
```

## Setup Instructions

1. **Create the Directory**: 
   Manually create a folder named `user_data` in your project root (or your preferred location).

2. **Configure Environment Variable**:
   Update your `.env` file to point to this directory. Use an absolute path.

   ```dotenv
   APP_DATA_DIRECTORY=C:\path\to\your\project\user_data
   
   # Required for PPTX export functionality
   TEMP_DIRECTORY=C:\path\to\your\project\user_data\temp
   ```

## Subdirectories Explanation

- **`images/`**: Contains subfolders named with UUIDs. Each subfolder corresponds to a presentation or session and holds image assets used in slides.
- **`exports/`**: When you export a presentation as PDF or PPTX, the final files are saved here.
- **`temp/`**: Used by the backend (Puppeteer and Python services) to store temporary screenshots of DOM elements during the PPTX generation process. **Crucial for PPTX export to work correctly.**
- **`userConfig.json`**: A JSON file maintained by the application to save user settings.

## Troubleshooting

- **"TEMP_DIRECTORY environment variable not set"**: Ensure you have added the `TEMP_DIRECTORY` variable to your `.env` file and that it points to a valid path (usually inside `user_data/temp`).
- **Permission Issues**: Ensure the application has read/write permissions for the `user_data` folder.
