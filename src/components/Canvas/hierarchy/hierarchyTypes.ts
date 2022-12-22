import { objectR } from "../Objects/objectTypes";
import { meshProps } from "../Objects/Transform/Mesh/types";

interface hierarchyDataObjectI {
  name: string;
  type: string;
  transform: {
    meshData: meshProps;
    visible: boolean;
  };
  zIndex: number;
  specific: {
    [key: string]: any;
  };
}

interface hierarchyR {
  getSceneObjects: () => sceneObjectsR;
  intantiateSceneObjects: () => sceneObjectsR;
  addObject: (hierarchyDataObject: hierarchyDataObjectI) => objectR;
  deleteObject: (objectName: string) => void;
}

interface getSceneObjectByProps {
  name: string;
}

interface deleteSceneObjectByProps {
  name: string;
}

interface sceneObjectsR {
  add: (objectToAdd: hierarchyDataObjectI) => objectR;
  deleteBy: ({ name }: deleteSceneObjectByProps) => void;
  getSceneObjectBy: ({ name }: getSceneObjectByProps) => objectR;
  getAll: () => objectR[];
  sortBy: ({ zIndex }: sortByProps) => void;
  getAllFilteredBy: ({
    includes,
    excludes,
  }: getAllFilteredByProps) => objectR[];
}

interface sortByProps {
  zIndex: boolean;
}

interface filterProps {
  toFilter: objectR[];
  includeOrExclude: boolean;
  names?: string[];
  types?: string[];
  zIndexRange?: [number, number];
}

type filterProps_ROO = RequireOnlyOne<
  filterProps,
  "names" | "types" | "zIndexRange"
>;

interface filterI {
  names?: string[];
  types?: string[];
  zIndexRange?: [number, number];
}

type filterI_ROO = RequireOnlyOne<filterI, "names" | "types" | "zIndexRange">;

interface getAllFilteredByProps {
  includes?: filterI_ROO;
  excludes?: filterI_ROO;
}

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

export {
  hierarchyDataObjectI,
  getSceneObjectByProps,
  hierarchyR,
  deleteSceneObjectByProps,
  sceneObjectsR,
  sortByProps,
  filterProps_ROO,
  filterI_ROO,
  getAllFilteredByProps,
};
