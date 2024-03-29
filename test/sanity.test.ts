import jsonld from "../src";
import documentLoader from "./__fixtures__/documentLoader";

describe("returns void when cannonizing data", () => {
  // "@id"s are Absolute IRIs
  const goodJsonLd = {
    "@context": { "@vocab": "https://example.com/vocab#" },
    "@id": "urn:uuid:55b6f167-dcad-4dbd-acdc-33922c053ad5",
    "items": [
      {
        "@id": "urn:uuid:2cb13e3f-c3dd-4cf9-b7e2-a7378fc88173",
        "@type": "c6f68dcd-d02d-4eb4-8787-66a57a4ce00f",
        "field0": "1",
      }
    ]
  };

  // "@id"s are not Absolute IRIs
  const badJsonLd = {
        "@context": { "@vocab": "https://example.com/vocab#" },
        "@id": "55b6f167-dcad-4dbd-acdc-33922c053ad5",
        "items": 
        [
            {
              "@id": "2cb13e3f-c3dd-4cf9-b7e2-a7378fc88173",
              "@type": "c6f68dcd-d02d-4eb4-8787-66a57a4ce00f",
              "field0": "1",
            }
        ]
        
    }

  it("can canonize valid JSON-LD", async () => {
    await jsonld.canonize(goodJsonLd, {
      algorithm: "URDNA2015",
      format: "application/n-quads",
      documentLoader,
      useNative: false
    });
  });
  
  
  it('should error on bad jsonld', async () => {
    return expect((async () => {
      await jsonld.canonize(badJsonLd, {
        algorithm: "URDNA2015",
        format: "application/n-quads",
        documentLoader,
        useNative: false
      });
    })()).rejects.toBeDefined();
  })

    it('can safely canonize valid JSON-LD', async () => {
      await jsonld.safeCanonize(goodJsonLd, { documentLoader })
    })

    it('it fails to safely canonize invalid JSON-LD', async () => {
        try {
            await jsonld.safeCanonize(badJsonLd, { documentLoader })
        } catch(ex) {
          const expectedErrors = [
            "Invalid JSON-LD ID at /@id. Using this value would allow the data in the object to be mutable.",
            "Invalid JSON-LD ID at /items/0/@id. Using this value would allow the data in the object to be mutable."
          ]
          const errors = JSON.parse((ex as Error).message);
          expect(errors[0]).toStrictEqual(expectedErrors[0])
          expect(errors[1]).toStrictEqual(expectedErrors[1])
        }
    })
});
