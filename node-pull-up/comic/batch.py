import sys, os, cv2
from multiprocessing import Pool
sys.path.insert(0, os.path.dirname(__file__))
from comic import comic
src, dst, n = sys.argv[1], sys.argv[2], int(sys.argv[3])
def job(f):
    im = cv2.imread(os.path.join(src, f)); cv2.imwrite(os.path.join(dst, f), comic(im), [cv2.IMWRITE_PNG_COMPRESSION, 1])
if __name__ == "__main__":
    fs = sorted(os.listdir(src))
    with Pool(n) as p:
        for i, _ in enumerate(p.imap_unordered(job, fs, chunksize=8)):
            if i % 150 == 0: print(i, "/", len(fs), flush=True)
