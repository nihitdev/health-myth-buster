"""Normalize supplied recordings locally, preserving the original files and substantive speech."""
import json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'deliverables/full-pitch';OUT.mkdir(parents=True,exist_ok=True)
AUDIO=OUT/'audio';AUDIO.mkdir(exist_ok=True)
parts=[('Nihit','nihit.mp3'),('Rudransh','rudrash.mp4'),('Priyushi','prushi.ogg'),('Ahika','ahika.ogg')]
def duration(file):return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(file)]))
timeline=[];cursor=1.3
for name,filename in parts:
 source=Path.home()/'Downloads'/filename
 measure=subprocess.run(['ffmpeg','-hide_banner','-i',str(source),'-vn','-af','highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
 stats=json.loads(measure[measure.rindex('{'):measure.rindex('}')+1])
 trim_prefix=2.05 if name=='Priyushi' else 0
 af=f"highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={stats['input_i']}:measured_TP={stats['input_tp']}:measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}:offset={stats['target_offset']}:linear=true,aresample=48000"
 target=AUDIO/(name.lower()+'.wav')
 subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(trim_prefix),'-i',str(source),'-vn','-af',af,'-ar','48000','-ac','1','-c:a','pcm_s16le',str(target)],check=True)
 d=duration(target);timeline.append({'name':name,'filename':filename,'audio':str(target),'start':round(cursor,3),'end':round(cursor+d,3),'duration':d,'normalization':stats,'trimPrefix':trim_prefix,'editNote':'Full-name self-introduction omitted to follow first-name-only video instruction.' if trim_prefix else 'No speech edits.'})
 cursor+=d+.25
 print(name,'normalized:',round(d,2),'s',flush=True)
# A short opening, quarter-second speaker pauses, and a closing hold keep the total under 3 min.
lead=AUDIO/'lead.wav';gap=AUDIO/'gap.wav';tail=AUDIO/'tail.wav'
for file,d in [(lead,1.3),(gap,.25),(tail,1.4)]:
 subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','anullsrc=r=48000:cl=mono','-t',str(d),'-c:a','pcm_s16le',str(file)],check=True)
files=[lead]
for i,part in enumerate(timeline):
 files.append(Path(part['audio']))
 if i<3:files.append(gap)
files.append(tail)
concat=AUDIO/'concat.txt';concat.write_text('\n'.join("file '"+str(p).replace("'","'\\''")+"'" for p in files))
combined=AUDIO/'full-pitch.wav'
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i',str(concat),'-c:a','pcm_s16le',str(combined)],check=True)
total=duration(combined);assert 120<=total<=180,total
(OUT/'timeline.json').write_text(json.dumps({'parts':timeline,'duration':total,'intro':1.3,'speakerGap':.25,'closing':1.4,'speedChanges':False,'audio':str(combined)},indent=2))
print('Full pitch:',round(total,3),'seconds; all original files unchanged.',flush=True)
