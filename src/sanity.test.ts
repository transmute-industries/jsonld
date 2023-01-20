import jsonld from ".";
import documentLoader from "./__fixtures__/documentLoader";

const canonize = async (
  input: any,
  { documentLoader, expansion, skipExpansion }: any
) => {
  return jsonld.canonize(input, {
    algorithm: "URDNA2015",
    format: "application/n-quads",
    documentLoader,
    expansion,
    skipExpansion,
    useNative: false
  });
};

describe("returns void when cannonizing data", () => {
  const goodCredential = {
    id: "urn:uuid:55b6f167-dcad-4dbd-acdc-33922c053ad5",
    type: ["VerifiableCredential"],
    issuer: "did:key:z6MktWjP95fMqCMrfNULcdszFeTVUCE1zcgz3Hv5bVAisHgk",
    issuanceDate: "2023-01-18T09:15:54.604Z",
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    credentialSubject: [
      {
        field0: "1",
        field1: "2",
        "@context": ["schema#c6f68dcd-d02d-4eb4-8787-66a57a4ce00f"],
        id: "urn:uuid:2cb13e3f-c3dd-4cf9-b7e2-a7378fc88173",
        type: "c6f68dcd-d02d-4eb4-8787-66a57a4ce00f"
      }
    ]
  };

  const badCredential = {
        "id": "55b6f167-dcad-4dbd-acdc-33922c053ad5",
        "type": ["VerifiableCredential"],
        "issuer": "did:key:z6MktWjP95fMqCMrfNULcdszFeTVUCE1zcgz3Hv5bVAisHgk",
        "issuanceDate": "2023-01-18T09:15:54.604Z",
        "@context": [
            "https://www.w3.org/2018/credentials/v1"
        ],
        "credentialSubject": 
        [
            {
                "field0": "1",
                "field1": "2",
                "@context": ["schema#c6f68dcd-d02d-4eb4-8787-66a57a4ce00f"],
                "id": "2cb13e3f-c3dd-4cf9-b7e2-a7378fc88173",
                "type": "c6f68dcd-d02d-4eb4-8787-66a57a4ce00f"
            }
        ]
        
    }

  it("can canonize valid vc", async () => {
    const nquads = await canonize(goodCredential, { documentLoader });
    expect(nquads.length).toBeGreaterThan(0);
  });

  it('doesn\'t fails to canonize invalid vc', async () => {
        const nquads = await canonize(badCredential, { documentLoader })
        expect(nquads.length).toBe(0);
    })

    it('can safely canonize valid vc', async () => {
        const nquads = await jsonld.safeCanonize(goodCredential, { documentLoader })
        expect(nquads.length).toBeGreaterThan(0);
    })

    it('it fails to safely canonize invalid vc', async () => {
        try {
            await jsonld.safeCanonize(badCredential, { documentLoader })
        } catch(ex) {
            expect((ex as any).message).toBe("[\"Invalid JSON-LD ID at /id. Using this value would allow the data in the object to be mutable.\",\"Invalid JSON-LD ID at /credentialSubject/0/id. Using this value would allow the data in the object to be mutable.\"]")
        }
    })
});
