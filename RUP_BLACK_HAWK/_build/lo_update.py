# Abre un .docx en LibreOffice, actualiza índices y campos, y exporta PDF (y opcionalmente un .docx actualizado).
import sys, os, time, subprocess, tempfile, uno
from com.sun.star.beans import PropertyValue
sys.path.insert(0, '/root/.claude/skills/synced/bbf048cf-1638-4fee-9401-ba48416d8c23_19141966-e7c2-4632-9de2-c858c044e509/docx/scripts')
from office.soffice import get_soffice_env
def pv(n, v):
    p = PropertyValue(); p.Name = n; p.Value = v; return p
src = os.path.abspath(sys.argv[1]); pdf = os.path.abspath(sys.argv[2]); out_docx = os.path.abspath(sys.argv[3]) if len(sys.argv) > 3 else None
prof = tempfile.mkdtemp(prefix='lo_prof_')
pipe = 'lopipe%d' % os.getpid()
proc = subprocess.Popen(['soffice', f'-env:UserInstallation=file://{prof}', '--headless', '--invisible', '--nologo', '--norestore', f'--accept=pipe,name={pipe};urp;'], env=get_soffice_env())
ctx = None
local = uno.getComponentContext()
resolver = local.ServiceManager.createInstanceWithContext('com.sun.star.bridge.UnoUrlResolver', local)
for _ in range(60):
    try:
        ctx = resolver.resolve(f'uno:pipe,name={pipe};urp;StarOffice.ComponentContext'); break
    except Exception:
        time.sleep(1)
smgr = ctx.ServiceManager
desktop = smgr.createInstanceWithContext('com.sun.star.frame.Desktop', ctx)
doc = desktop.loadComponentFromURL(uno.systemPathToFileUrl(src), '_blank', 0, (pv('Hidden', True),))
for _ in range(2):
    doc.TextFields.refresh()
    idx = doc.DocumentIndexes
    for i in range(idx.Count): idx.getByIndex(i).update()
doc.storeToURL(uno.systemPathToFileUrl(pdf), (pv('FilterName', 'writer_pdf_Export'),))
if out_docx:
    doc.storeToURL(uno.systemPathToFileUrl(out_docx), (pv('FilterName', 'MS Word 2007 XML'),))
doc.close(True)
try: desktop.terminate()
except Exception: pass
proc.wait(timeout=30)
print('ok')
