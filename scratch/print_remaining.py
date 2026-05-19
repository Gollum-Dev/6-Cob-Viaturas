import sys

def print_parts(start, end):
    for i in range(start, end + 1):
        path = f'c:\\Antigravite\\Viatura BM\\scratch\\insert_militares_part{i}.sql'
        try:
            with open(path, 'r', encoding='utf-8') as f:
                print(f"--- START OF PART {i} ---")
                print(f.read())
                print(f"--- END OF PART {i} ---\n")
        except Exception as e:
            print(f"Error reading part {i}: {e}")

if __name__ == '__main__':
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 4
    end = int(sys.argv[2]) if len(sys.argv) > 2 else 7
    print_parts(start, end)
