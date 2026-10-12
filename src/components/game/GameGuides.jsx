import GameLoader from "./GameLoader";
import RingGuide from "./RingGuide";
import "./GameGuides.css";

// Left: ring (slightly raised), right: Cinnamoroll. Each owns its own failure.
const GameGuides = () => (
  <div className="game-guides">
    <RingGuide />
    <GameLoader />
  </div>
);

export default GameGuides;
