import { Composition } from "remotion";
import { GertrudVideo, DURATION } from "./Video";
export const RemotionRoot: React.FC = () => (
  <Composition id="Gertrud" component={GertrudVideo} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
);
