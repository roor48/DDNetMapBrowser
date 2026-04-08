def ChangeDir():
    import os
    # 현재 경로로 이동
    current_path = os.path.dirname(os.path.abspath(__file__))
    os.chdir(current_path)
    print(os.getcwd())
