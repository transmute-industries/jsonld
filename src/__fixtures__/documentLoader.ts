import { dids } from "./dids";
import { contexts } from "./contexts";

const documentLoader = (iri: string): any => {
  if (contexts[iri]) {
    return { document: contexts[iri] };
  }

  if (dids[iri.split("#")[0]]) {
    const document = dids[iri.split("#")[0]];
    return { document };
  }

  console.warn(iri);
  throw new Error(`iri ${iri} not supported`);
};

export default documentLoader;
