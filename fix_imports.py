import os

def remove_extensions(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                print(f"Processing: {filepath}")
                # Simple string replacements
                new_content = content.replace('.ts\'', '\'')
                new_content = new_content.replace('.tsx\'', '\'')
                new_content = new_content.replace('.ts"', '"')
                new_content = new_content.replace('.tsx"', '"')

                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated: {filepath}")
                else:
                    print(f"No changes: {filepath}")

if __name__ == "__main__":
    remove_extensions('src')