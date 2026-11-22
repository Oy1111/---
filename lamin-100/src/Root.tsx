import { Composition } from "remotion";
import { LaminVideo, DURATION } from "./Video";
import { Lab } from "./Lab";
export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="Lab" component={Lab} durationInFrames={1} fps={30} width={1080} height={1920} />
  <Composition id="Lamin" component={LaminVideo} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
  </>
);
