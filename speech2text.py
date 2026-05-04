import subprocess, tempfile, os
def transcribe_audio(file_path):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp.write(open(file_path,'rb').read())
        tmp_path = tmp.name
    out = subprocess.check_output(["pocketsphinx_continuous", "-infile", tmp_path, "-logfn", "/dev/null"], text=True)
    os.unlink(tmp_path)
    return out.strip()
