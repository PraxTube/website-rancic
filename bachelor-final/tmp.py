import os


s = "  <iframe src=\"pics/"

ss = "\" width=\"100%\" height=\"500px\" style=\"margin-top: 35px;\">"

sss = """\n    <p>It appears you don't have a PDF plugin for this browser.</p>
  </iframe>
"""

for f in os.listdir("pics/"):
    print(s + f + ss + sss)
