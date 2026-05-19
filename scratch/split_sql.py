import os

def split_sql():
    sql_path = r'c:\Antigravite\Viatura BM\scratch\insert_militares.sql'
    if not os.path.exists(sql_path):
        print("SQL file not found!")
        return

    with open(sql_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by the "DO $$" block
    parts = content.split('DO $$')
    header = parts[0] # CREATE EXTENSION and BEGIN;
    blocks = parts[1:]

    # We want to group these blocks into batches of 10
    batch_size = 10
    batches = [blocks[i:i + batch_size] for i in range(0, len(blocks), batch_size)]

    for idx, batch in enumerate(batches):
        batch_content = "CREATE EXTENSION IF NOT EXISTS pgcrypto;\nBEGIN;\n\n"
        for block in batch:
            # Reconstruct the block by adding back "DO $$"
            batch_content += "DO $$" + block + "\n"
        
        # Make sure it ends with COMMIT;
        if "COMMIT;" not in batch_content:
            batch_content += "\nCOMMIT;\n"

        out_path = f'c:\\Antigravite\\Viatura BM\\scratch\\insert_militares_part{idx+1}.sql'
        with open(out_path, 'w', encoding='utf-8') as out_f:
            out_f.write(batch_content)
        print(f"Written batch {idx+1} to {out_path}")

if __name__ == '__main__':
    split_sql()
