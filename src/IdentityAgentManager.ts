import { Web5IdentityAgent } from "@web5/identity-agent";
import {
  AgentDidApi,
  AgentSyncApi,
  HdIdentityVault,
  SyncEngineLevel,
  AgentDwnApi,
  DwnDidStore,
  type Web5Agent,
} from "@web5/agent";
import {
  MessageStoreLevel,
  DataStoreLevel,
  EventLogLevel,
  ResumableTaskStoreLevel,
} from "@tbd54566975/dwn-sdk-js";
import { Web5 } from "@web5/api";
import {
  profileProtocol,
  type ProfileProtocol, 
} from "./profile-protocol";
import { DidDht, DidJwk, DidResolverCacheLevel } from "@web5/dids";
import { LevelStore } from "@web5/common";

export class IdentityAgentManager {
  private static singletonInstance: IdentityAgentManager;

  public agent!: Web5IdentityAgent;

  public static async singleton(): Promise<IdentityAgentManager> {

    if (IdentityAgentManager.singletonInstance !== undefined) {
      return IdentityAgentManager.singletonInstance;
    }

    const identityAgentManager = new IdentityAgentManager();

    identityAgentManager.agent = await IdentityAgentManager.createAgent();

    IdentityAgentManager.singletonInstance = identityAgentManager;
    return IdentityAgentManager.singletonInstance;
  }

  private static async createAgent(): Promise<Web5IdentityAgent> {
    const agentVault = new HdIdentityVault({
      keyDerivationWorkFactor: 210_000,
      store: new LevelStore({ }),
    });
  
    const didApi = new AgentDidApi({
      didMethods: [DidDht, DidJwk],
      resolverCache: new DidResolverCacheLevel({ }),
      store: new DwnDidStore(),
    });
  
    const syncEngine = new SyncEngineLevel({ });
  
    const syncApi = new AgentSyncApi({ syncEngine });
  
    const dwnApi = new AgentDwnApi({
      dwn: await AgentDwnApi.createDwn({
        dataPath: "AGENT",
        didResolver: didApi,
        dataStore: new DataStoreLevel({ }),
        messageStore: new MessageStoreLevel({ }),
        eventLog: new EventLogLevel({ }),
        resumableTaskStore: new ResumableTaskStoreLevel({ }),
      }),
    });
  
    const agent = await Web5IdentityAgent.create({
      dwnApi,
      didApi,
      agentVault,
      syncApi,
    });
  
    return agent;
  };

  public async isFirstLaunch(): Promise<boolean> {
    return await this.agent.firstLaunch();
  };

  public bootstrap = async (pin: string) => {
    console.log("Bootstrapping agent...");
    await this.agent.initialize({ password: pin }); // NOTE: I think `agent.initialize()` is poorly named, should be something like `agent.bootstrap()`
    console.log("Initializing agent...");
    await this.initialize(pin);
  };

  public initialize = async (pin: string) => {
    await this.agent.start({ password: pin });
    // TODO: Once selective sync is enabled, only sync for records that the mobile identity agent
    // cares about. We DO NOT want to sync every record the user has in their DWN to their mobile device.
  //   agent.sync.startSync({ interval: String(120_000) }).catch((error) => {
  //     console.error(`Sync failed: ${error}`);
  //   });
  };

  public web5 = (didUri: string) => {
    return new Web5({ agent: this.agent, connectedDid: didUri });
  };

  public createIdentity = async (name: string, dwnEndpoint: string) => {
    const agent = this.agent;

    // Generate a new Identity for the end-user.

    console.log("Creating DID DHT...");
    const identity = await agent.identity.create({
      didMethod: "dht",
      metadata: { name },
      didOptions: {
        services: [
          {
            id: "dwn",
            type: "DecentralizedWebNode",
            serviceEndpoint: [dwnEndpoint],
            enc: "#enc",
            sig: "#sig",
          },
        ],
        verificationMethods: [
          {
            algorithm: "Ed25519",
            id: "sig",
            purposes: ["assertionMethod", "authentication"],
          },
          {
            algorithm: "secp256k1",
            id: "enc",
            purposes: ["keyAgreement"],
          },
        ],
      },
    });

    console.log('Adding identity for agent to manage...');
    await agent.identity.manage({ portableIdentity: await identity.export() });

    // Install the profile protocol in the DWN, for the newly created identity tenant
    const web5 = new Web5({ agent, connectedDid: identity.did.uri });
    await web5.dwn.protocols.configure({
      message: {
        definition: profileProtocol,
      },
    });

    // Write the profile
    const profile: ProfileProtocol = {
      did: identity.did.uri,
      name,
    };
    await web5.dwn.records.write({
      data: profile,
      message: {
        schema: profileProtocol.types.profile.schema,
        protocol: profileProtocol.protocol,
        protocolPath: "profile",
      },
      store: true,
    });

    // Register the new identity with syncManager so that all records associated
    // with it (including the profile) get synced to the remote DWN servers.
    await agent.sync.registerIdentity({ did: identity.did.uri });
  };
}

// export const IdentityAgentManager = {
//   getAgent,
//   initialize,
//   isFirstLaunch,
//   isAgentStarted,
//   startAgent,
//   createIdentity,
//   listIdentities,
//   web5,
// };
