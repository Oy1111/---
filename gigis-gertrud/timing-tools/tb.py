import sherpa_onnx, soundfile as sf, numpy as np, sys, time
d='/tmp/mdl/sherpa-onnx-whisper-turbo/'
r=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=d+'turbo-encoder.int8.onnx',decoder=d+'turbo-decoder.int8.onnx',tokens=d+'turbo-tokens.txt',language='da',task='transcribe',num_threads=4)
a,sr=sf.read(sys.argv[1],dtype='float32')
def run(s0,s1):
    s=r.create_stream();s.set_option("max_tokens_per_second","25");s.accept_waveform(sr,a[int(s0*sr):int(s1*sr)]);r.decode_stream(s);return s.result.text
if __name__=='__main__':
    st,en,win,hop=map(float,sys.argv[2:6]);t=st;t0=time.time()
    while t<en: print(f'{t:5.1f}',run(t,t+win),flush=True);t+=hop
    print('time',time.time()-t0)
