import json, subprocess, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'deliverables/health-myth-buster'
voice=Path(sys.argv[1])
def probe(p):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,width,height','-of','json',str(p)]))
meta=json.loads((OUT/'media/capture.json').read_text());raw=Path(meta['rawVideo'])
duration=float(probe(voice)['format']['duration']);rawdur=float(probe(raw)['format']['duration']);offset=max(0,rawdur-duration)
target=OUT/'Health_Myth_Buster_AI_Trailer.mp4'
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-ss',str(offset),'-i',str(raw),'-i',str(voice),'-map','0:v:0','-map','1:a:0','-t',str(duration),'-r','30','-c:v','libx264','-preset','fast','-crf','20','-threads','2','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart',str(target)],check=True)
report=probe(target);report.update({'syntheticNarration':True,'narrationProvider':'Fish Audio, supplied by user','purpose':'Short promotional trailer, not the required 2–3-minute four-student submission pitch','originalVoiceDuration':duration})
(OUT/'trailer-verification.json').write_text(json.dumps(report,indent=2))
for sec in [0,8,12,17,22,27,31]:
 subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(sec),'-i',str(target),'-frames:v','1',str(OUT/'media'/f'trailer-frame-{sec}.png')],check=True)
print('Created trailer:',target)
print(json.dumps(report,indent=2))
