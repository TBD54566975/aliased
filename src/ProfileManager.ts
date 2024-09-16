import type { PortableDid } from "@web5/dids";
import { DidDht } from "@web5/dids";


/**
 * converts a given type: (T[] | undefined) into just T.
 * This is used as a workaround to extract the `Jwk` type from `PortableDid.privateKeys` because `Jwk` is not exported.
 */
type ExtractArrayType<T> = T extends (infer U)[] ? U : never;

export type Profile = {
  profileName: string;
  did: string;
  dwnEndpoint: string;
  privateKeyJwk: ExtractArrayType<PortableDid['privateKeys']>;
};

/**
 * ProfileManager is a singleton class that manages the user's profiles.
 */
export class ProfileManager {
  private static singletonInstance: ProfileManager;

  public static singleton(): ProfileManager {
      if (ProfileManager.singletonInstance === undefined) {
      ProfileManager.singletonInstance = new ProfileManager();
      }
      return ProfileManager.singletonInstance;
  }

  /**
   * Inserts a new profile if it does not exists based on the profile name, otherwise updates the existing profile.
   */
  public async createProfile(options: {
    profileName: string;
    dwnEndpoint: string;
  }): Promise<Profile> {
    const { profileName, dwnEndpoint } = options;

    console.log('Creating profile...');
    const didDht = await DidDht.create();
    const privateKeyJwk = (await didDht.export()).privateKeys![0];

    console.log('Profile Name:', profileName);
    console.log('DID:', didDht.uri);
    console.log('DWN Endpoint:', dwnEndpoint);

    const profile = {
      profileName,
      did: didDht.uri,
      dwnEndpoint,
      privateKeyJwk
    };

    // Save profile to local storage
    this.upsertProfile(profile);
    return profile;
  }

  /**
   * Gets the list of managed profiles.
   */
  public getProfiles(): Profile[] {
    // Get the profiles from local storage
    const profiles = localStorage.getItem('profiles');

    // Return an empty array if there are no profiles
    if (!profiles) {
      return [];
    }

    return JSON.parse(profiles);
  }

  /**
   * Inserts a new profile if it does not exists based on the profile name, otherwise updates the existing profile.
   */
  public upsertProfile(profile: Profile): void {
    const profiles = this.getProfiles();

    // Check if the profile already exists (find its index in the profile array)
    const profileIndex = profiles.findIndex((p) => p.profileName === profile.profileName);

    if (profileIndex === -1) {
      profiles.push(profile);
    } else {
      profiles[profileIndex] = profile;
    }

    localStorage.setItem('profiles', JSON.stringify(profiles));
    console.log('Profile upserted:', profile.profileName);
  }
}