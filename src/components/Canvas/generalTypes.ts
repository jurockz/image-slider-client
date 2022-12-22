interface timeInterface {
  start: number;
  end: number;
  differenceInSec: number;
}

interface rendererR {
  renderScene: () => ReturnType<typeof setTimeout>
}

export {
  rendererR,
  timeInterface
};
