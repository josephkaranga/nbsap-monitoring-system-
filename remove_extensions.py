import os
import re

def remove_extensions_from_imports(directory):
    # Pattern to match import statements with .ts or .tsx extensions
    pattern = r"(import\s+.*?\s+from\s+['\"](.*?)(\.ts|\.tsx)['\"])|(import\s*\(\s*['\"](.*?)(\.ts|\.tsx)['\"]\s*\))"

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Replace .ts and .tsx extensions in import statements
                def replace_extension(match):
                    if match.group(1):  # import ... from '...'
                        return match.group(1).replace(match.group(3), '')
                    elif match.group(4):  # import('...')
                        return match.group(4).replace(match.group(6), '')

                new_content = re.sub(pattern, replace_extension, content)

                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated: {filepath}")

if __name__ == "__main__":
    remove_extensions_from_imports('src')