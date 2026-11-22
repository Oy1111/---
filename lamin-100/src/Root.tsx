import { Composition } from "remotion";
import { LaminVideo, DURATION } from "./Video";
export const RemotionRoot: React.FC = () => (
  <Composition id="Lamin" component={LaminVideo} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
);
