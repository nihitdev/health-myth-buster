from pathlib import Path
import html,json,re
out=Path('deliverables/health-myth-buster')
parts=[
('Nihit','0:00–0:40','Introduce the team and explain the problem', '''Hello! I’m Nihit. We are team one one two seven, zero zero three two, from Birla Open Minds International School in Indore.
A health message can sound convincing just because a friend forwards it. But confidence is not evidence. People need a simple way to pause and check.
I built and developed Health Myth Buster to help students, families, teachers and NGO volunteers inspect general health claims. It provides a verdict, a short explanation and official source links.'''),
('Rudransh','0:40–1:20','Type a claim and demonstrate the FALSE result', '''I’m Rudransh. Let’s try a claim from our reviewed database: “Antibiotics cure the common cold.”
I enter it and press Check Claim. The result is FALSE. The explanation says that colds are caused by viruses, and antibiotics do not cure them.
We can open the CDC and NHS sources and read the evidence. Users can also tap an example instead of typing.
The tool is for awareness. It cannot diagnose an illness or prescribe treatment.'''),
('Priyushi','1:20–2:00','Show UNVERIFIED and explain the method', '''I’m Priyushi. Now I’ll enter: “Blue notebooks prevent headaches.” The answer is UNVERIFIED.
Our tool does not know enough to check that claim. Unknown does not automatically mean false.
The checker uses transparent rules, not a machine-learning model or an AI API. It normalizes wording and looks for required concepts and reviewed patterns.
There are thirty-six evidence-reviewed entries, each with at least two official references. Thirty-one more candidates remain separate while awaiting review.'''),
('Ahika','2:00–2:40','Explain testing honestly, make the pitch and close', '''I’m Ahika. Our recorded software checks include two hundred and forty-seven unit tests and eight browser tests. These are engineering checks, not a medical accuracy score.
We still need to complete the required evaluation with other people and record genuine before-and-after results. The Testing Lab helps us save and export those evaluations without collecting names or contact details.
Schools and NGOs can use the free website for health-literacy activities. Please open the link in our presentation, try a claim and read the sources.
Thank you. Always ask a doctor.''')]
intro='''# Human pitch script — team_1127_0032

**School:** Birla Open Minds International School, Indore, India
**Tool:** https://health-myth-buster-amber.vercel.app/
**Target:** about 2 minutes 40 seconds at a calm, practiced pace. Rehearse with a timer and stay below 3 minutes.

This is the full human presentation. The separate 32-second MP3 is used only for the AI trailer. All four students must speak in the submitted pitch. Use first names only in the recording, get parent/guardian permission, and record in landscape.

**Before final recording:** the instructions ask for a real local health message collected with permission. Add one genuine, anonymized example to the opening after the team introduction; do not claim the database example came from a relative. Keep it brief and trim other lines if needed to remain under 3 minutes.

The development credit belongs to Nihit. The other names below identify speaking parts, not invented development contributions. Practice the ideas and say them naturally in your own words.

'''
md=intro
for name,timing,cue,spoken in parts:
 md+=f'## {name} · {timing}\n\n**Show:** {cue}.\n\n'+spoken+'\n\n'
 (out/f'Speaking_Part_{name}.txt').write_text(f'{name} — {timing}\nShow: {cue}\n\n{spoken}\n')
md+='''## After you complete genuine participant testing

Replace Ahika’s sentence about unfinished evaluation only after the records exist. Use:

“We asked [actual number] other people to enter [actual total] claims in their own words. We recorded [correct] correct answers out of [total], or [actual percentage] percent. We improved [actual change] and retested the same claims, obtaining [actual after result].”

Do not read the brackets aloud. Do not invent numbers, imply classmates already did development work, or call automated test results user accuracy. Have a teacher or doctor review the final claim list.

## Recording checklist

- Each student understands their section and speaks themselves.
- Pronounce the team ID as “team one one two seven, zero zero three two.”
- Use the actual website while Rudransh and Priyushi demonstrate results.
- Keep personal information, surnames and private chats out of the video frame; crop the website’s full-name credit strip if recording the app.
- Record horizontally, keep the camera steady and speak in a quiet room.
- Review the audio, pacing and all source links before uploading.
- Upload the PPT and full human pitch separately; the AI trailer is an extra, not a substitute.
'''
(out/'Human_Pitch_Script.md').write_text(md)
body='<h1>Human pitch script</h1><p class="meta">team_1127_0032 · Birla Open Minds International School · Indore, India</p><p><strong>Target: about 2:40.</strong> Rehearse with a timer. Every member speaks in their own voice. The separate AI trailer is not the full submission pitch.</p>'
for name,timing,cue,spoken in parts:
 body+=f'<section><h2>{name} <span>{timing}</span></h2><p class="cue">Show: {html.escape(cue)}</p>'+''.join('<p>'+html.escape(p)+'</p>' for p in spoken.split('\n'))+'</section>'
body+='<section><h2>Finish before recording</h2><p>Add one real local health message collected with permission. Complete genuine participant testing and replace the unfinished-testing sentence only when records exist. Each student must independently finish Slide 9. Get guardian permission, use first names, and film in landscape.</p></section>'
(out/'human-script.html').write_text('<!doctype html><html><head><meta charset="utf-8"><style>body{font:16px/1.55 Arial,sans-serif;color:#172e3d;margin:40px}h1{color:#087b70;font-size:32px;margin-bottom:5px}h2{font-size:21px;color:#087b70}h2 span{float:right;font-size:15px;color:#526970}p{margin:9px 0}.meta,.cue{color:#526970;font-size:14px}section{break-inside:avoid;border-top:1px solid #dce6e3;padding-top:10px;margin-top:22px}@page{size:A4;margin:18mm}</style></head><body>'+body+'</body></html>')
words=sum(len(re.findall(r"\b[\w’]+\b",p[3])) for p in parts)
print('Spoken-script word count:',words,'Estimated minutes at 130 wpm:',round(words/130,2))
