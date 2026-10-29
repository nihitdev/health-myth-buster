"""Create local draft timing/transcript data; no recordings are uploaded to a speech service."""
import json,os,subprocess
import numpy as np
from pathlib import Path
from faster_whisper import WhisperModel
os.environ['HF_HUB_DISABLE_XET']='1'
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'deliverables/full-pitch'
print('Loading local English speech model...',flush=True)
model=WhisperModel('base.en',device='cpu',compute_type='int8',cpu_threads=4,download_root='/tmp/hmb-asr-models')
parts=[]
for name,filename in [('Nihit','nihit.mp3'),('Rudransh','rudrash.mp4'),('Priyushi','prushi.ogg'),('Ahika','ahika.ogg')]:
 print('Transcribing',name,flush=True)
 samples=np.frombuffer(subprocess.check_output(['ffmpeg','-loglevel','error','-i',str(Path.home()/'Downloads'/filename),'-vn','-ar','16000','-ac','1','-f','f32le','-']),dtype=np.float32)
 segments,info=model.transcribe(samples,language='en',beam_size=5,word_timestamps=True,vad_filter=True,initial_prompt='Health Myth Buster. Nihit, Rudransh, Priyushi, Ahika. Birla Open Minds International School, Indore. TRUE, FALSE, UNVERIFIED. CDC and NHS. Rule-based checker.')
 rows=[]
 for s in segments:
  rows.append({'start':s.start,'end':s.end,'text':s.text.strip(),'words':[{'start':w.start,'end':w.end,'word':w.word,'probability':w.probability} for w in (s.words or [])]})
  print(f'{name} [{s.start:.1f}-{s.end:.1f}] {s.text}',flush=True)
 parts.append({'name':name,'filename':filename,'segments':rows})
 (OUT/'transcripts.json').write_text(json.dumps(parts,indent=2))
(OUT/'Recording_Transcript_DRAFT.txt').write_text('\n\n'.join(p['name']+'\n'+'\n'.join(s['text'] for s in p['segments']) for p in parts)+'\n\nAutomatic local transcript; check names and wording against the recordings.\n')
print('Saved local transcript and word timing data.',flush=True)
