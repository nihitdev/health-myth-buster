"""Use supplied results as graphics, never synthesize or splice new claims into a student's voice."""
import json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'deliverables/ppt-update';OLD=ROOT/'deliverables/full-pitch'
tl=json.loads((OLD/'timeline.json').read_text());a=next(p for p in tl['parts'] if p['name']=='Ahika')['start']
# The original recording explicitly says testing is unfinished. Remove only that obsolete sentence.
cut_start=a+11.35;cut_end=a+18.55;cut_length=cut_end-cut_start
wav=OUT/'updated-pitch.wav'
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',tl['audio'],'-filter_complex',f'[0:a]atrim=end={cut_start},asetpts=PTS-STARTPTS[a];[0:a]atrim=start={cut_end},asetpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=0:a=1[out]','-map','[out]','-c:a','pcm_s16le',str(wav)],check=True)
total=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(wav)]))
close_start=a+29.1-cut_length;board_duration=close_start-cut_start;closing_duration=total-close_start
def duration(file):return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(file)]))
prefix=OUT/'video-prefix.mp4'
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(OLD/'Health_Myth_Buster_Full_Team_Pitch.mp4'),'-map','0:v:0','-an','-t',str(cut_start),'-c:v','copy','-map_metadata','-1','-map_chapters','-1',str(prefix)],check=True)
board_duration=close_start-duration(prefix)
clips=[prefix]
for name,image,d in [('results',OUT/'reported-results-card.png',board_duration),('closing',OLD/'frames/final-171.png',closing_duration)]:
 clip=OUT/(name+'-clip.mp4')
 subprocess.run(['ffmpeg','-y','-loglevel','error','-loop','1','-framerate','30','-i',str(image),'-t',str(d),'-an','-c:v','libx264','-preset','veryfast','-threads','2','-crf','21','-pix_fmt','yuv420p','-g','60',str(clip)],check=True)
 clips.append(clip)
listing=OUT/'video-segments.txt';listing.write_text('\n'.join("file '"+str(p)+"'" for p in clips))
target=OUT/'Health_Myth_Buster_Updated_Team_Pitch.mp4'
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',str(listing),'-i',str(wav),'-map','0:v:0','-map','1:a:0','-map_metadata','-1','-map_chapters','-1','-t',str(total),'-c:v','copy','-c:a','aac','-b:a','160k','-movflags','+faststart','-metadata','title=Health Myth Buster — team_1127_0032',str(target)],check=True)
# Normalize timestamps across the concatenated H.264 segments for smooth portal playback.
clean=OUT/'updated-pitch-clean.mp4'
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(target),'-map','0:v:0','-map','0:a:0','-vf','fps=30,setpts=N/(30*TB)','-fps_mode','cfr','-t',str(total),'-c:v','libx264','-preset','veryfast','-threads','2','-crf','18','-pix_fmt','yuv420p','-g','60','-c:a','copy','-movflags','+faststart',str(clean)],check=True)
clean.replace(target)
assert 120<=total<=180,total
decode=subprocess.run(['ffmpeg','-loglevel','error','-i',str(target),'-f','null','-'],capture_output=True,text=True,check=True)
assert not decode.stderr.strip(),decode.stderr
for sec in [143,147,151,157,163]:subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(sec),'-i',str(target),'-frames:v','1',str(OUT/f'updated-video-{sec}.png')],check=True)
(OUT/'Video_Update_Notes.json').write_text(json.dumps({'durationSeconds':total,'speechGenerated':False,'sourceRecordingsModified':False,'obsoleteSentenceRemoved':{'speaker':'Ahika','originalClipStart':11.35,'originalClipEnd':18.55},'onScreenHumanResults':json.loads((OUT/'User_Test_Summary.json').read_text()),'beforeAfterHumanResultsInvented':False},indent=2))
print('Updated video verified:',round(total,2),'seconds.',flush=True)
