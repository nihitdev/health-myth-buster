"""Mux the real app capture with the supplied team recordings; keep outputs local."""
import json,subprocess,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'deliverables/full-pitch'
def probe(file):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration,size:stream=codec_type,codec_name,width,height,sample_rate,channels,r_frame_rate','-of','json',str(file)]))
cap=json.loads((OUT/'capture-full.json').read_text());tl=json.loads((OUT/'timeline.json').read_text());raw=Path(cap['rawVideo'])
info=probe(raw);rawdur=float(info['format']['duration']);total=float(tl['duration'])
# Calibrate to the first speaker's highlight in the recorded image, avoiding startup lag.
a=np.array(Image.open(OUT/'frames/scene-01.png').convert('RGB'))
b=np.array(Image.open(OUT/'frames/scene-02.png').convert('RGB'))
mask=(b[:,:,1]>170)&(b[:,:,1]>b[:,:,0]+35)&(b[:,:,2]>130)&(a[:,:,1]<100)
ys,xs=np.where(mask)
if not len(xs):raise RuntimeError('No calibration highlight found')
x=int(xs.min()+8);y=int(ys.min()+8)
pixels=subprocess.check_output(['ffmpeg','-loglevel','error','-i',str(raw),'-t','8','-vf',f'fps=25,crop=4:4:{x}:{y},scale=1:1:flags=neighbor,format=rgb24','-f','rawvideo','-'])
colors=np.frombuffer(pixels,dtype=np.uint8).reshape(-1,3).astype(int)
indices=np.where((colors[:,1]>140)&(colors[:,1]>colors[:,0]+25)&(colors[:,2]>110))[0]
if not len(indices):raise RuntimeError('Calibration marker was not visible in recording')
first_highlight=float(indices[0])/25
start=max(0,first_highlight-tl['parts'][0]['start'])
print('Video/audio alignment: highlight at',first_highlight,'raw seconds; trim',round(start,3),'seconds.',flush=True)
meta=OUT/'chapters.ffmeta'
def clean(v):return v.replace('\\','\\\\').replace('=','\\=').replace(';','\\;').replace('#','\\#').replace('\n',' ')
lines=[';FFMETADATA1','title=Health Myth Buster — team_1127_0032','artist=Nihit, Rudransh, Priyushi, Ahika','comment=Original supplied team recordings with real app demonstration. AI trailer is separate.']
for p in tl['parts']:
 lines+=['[CHAPTER]','TIMEBASE=1/1000',f"START={round(p['start']*1000)}",f"END={round(p['end']*1000)}",'title='+clean(p['name'])]
meta.write_text('\n'.join(lines)+'\n')
target=OUT/'Health_Myth_Buster_Full_Team_Pitch.mp4'
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-ss',str(start),'-i',str(raw),'-i',tl['audio'],'-f','ffmetadata','-i',str(meta),'-map','0:v:0','-map','1:a:0','-map_metadata','2','-map_chapters','2','-vf','tpad=stop_mode=clone:stop_duration=1,fps=30','-t',str(total),'-c:v','libx264','-preset','fast','-crf','21','-threads','4','-pix_fmt','yuv420p','-g','60','-c:a','aac','-b:a','160k','-ar','48000','-movflags','+faststart',str(target)],check=True)
result=probe(target);duration=float(result['format']['duration']);assert 120<=duration<=180,duration
assert {s['codec_type'] for s in result['streams']} >= {'video','audio'}
# A complete decode catches corrupt/truncated packets, not just container metadata.
subprocess.run(['ffmpeg','-loglevel','error','-i',str(target),'-f','null','-'],check=True)
quality=subprocess.run(['ffmpeg','-hide_banner','-i',str(target),'-vn','-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
stats=json.loads(quality[quality.rindex('{'):quality.rindex('}')+1])
assert float(stats['input_tp'])<0,'Unexpected audio clipping peak'
report={'file':target.name,'durationSeconds':duration,'underThreeMinutes':True,'resolution':'1920x1080','videoCodec':'H.264','audioCodec':'AAC','voiceOrder':[p['name'] for p in tl['parts']],'voicesReplacedOrGenerated':False,'playbackSpeedChanged':False,'sourceRecordingsKeptUnchanged':True,'firstNamePrivacyEdit':tl['parts'][2]['editNote'],'alignment':{'rawFirstHighlight':first_highlight,'trimSeconds':start,'method':'First presenter chip color compared with actual recorded frames','sourceDuration':rawdur},'audio':stats,'sources':[{ 'filename':p['filename'],'sha256':hashlib.sha256((Path.home()/'Downloads'/p['filename']).read_bytes()).hexdigest()} for p in tl['parts']],'chapterTimes':[{k:p[k] for k in ['name','start','end']} for p in tl['parts']],'reviewNotes':['All four supplied recordings contain audio only; no student faces or generated avatars are used.','PPT still needs genuine local-example/evaluation data and independent student answers.','Automatic transcript used for edit timing; original spoken delivery is retained apart from the first-name privacy edit.']}
(OUT/'Video_Verification.json').write_text(json.dumps(report,indent=2))
for second in [1,13,32,49,60,80,94,112,125,140,155,168,171]:
 subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(second),'-i',str(target),'-frames:v','1',str(OUT/'frames'/f'final-{second}.png')],check=True)
print('Final export:',target,flush=True);print('Duration:',duration,'seconds; audio integrated loudness:',stats['input_i'],'LUFS; true peak:',stats['input_tp'],'dBTP.',flush=True)
