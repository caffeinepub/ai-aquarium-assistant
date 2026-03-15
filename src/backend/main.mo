import Text "mo:core/Text";
import List "mo:core/List";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module FishProfile {
    public func compareByName(a : FishProfile, b : FishProfile) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  public type FishProfile = {
    id : Nat;
    name : Text;
    scientificName : Text;
    habitat : Text;
    minTankSize : Nat;
    maxTankSize : Nat;
    minTemp : Nat;
    maxTemp : Nat;
    minPH : Float;
    maxPH : Float;
    diet : Text;
    compatibleWith : [Text];
    incompatibleWith : [Text];
    plants : [Text];
    substrate : Text;
    decorations : [Text];
    filtration : Text;
    lighting : Text;
  };

  public type WaterLog = {
    id : Nat;
    timestamp : Int;
    temperature : Float;
    ph : Float;
    ammonia : Float;
    nitrate : Float;
    notes : Text;
  };

  public type Reminder = {
    id : Nat;
    reminderType : Text;
    title : Text;
    description : Text;
    frequencyDays : Nat;
    lastDone : Int;
    nextDue : Int;
    enabled : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextFishId = 1;
  var nextLogId = 1;
  var nextReminderId = 1;
  let fishProfiles = Map.empty<Nat, FishProfile>();
  let waterLogs = Map.empty<Principal, List.List<WaterLog>>();
  let reminders = Map.empty<Principal, List.List<Reminder>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addFishProfile(profile : FishProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add fish profiles");
    };

    let id = nextFishId;
    nextFishId += 1;
    let newProfile = {
      id;
      name = profile.name;
      scientificName = profile.scientificName;
      habitat = profile.habitat;
      minTankSize = profile.minTankSize;
      maxTankSize = profile.maxTankSize;
      minTemp = profile.minTemp;
      maxTemp = profile.maxTemp;
      minPH = profile.minPH;
      maxPH = profile.maxPH;
      diet = profile.diet;
      compatibleWith = profile.compatibleWith;
      incompatibleWith = profile.incompatibleWith;
      plants = profile.plants;
      substrate = profile.substrate;
      decorations = profile.decorations;
      filtration = profile.filtration;
      lighting = profile.lighting;
    };

    fishProfiles.add(id, newProfile);
  };

  public query ({ caller }) func getFishById(id : Nat) : async ?FishProfile {
    fishProfiles.get(id);
  };

  public query ({ caller }) func searchFishByName(searchTerm : Text) : async [FishProfile] {
    fishProfiles.values().toArray().filter(
      func(profile) {
        profile.name.toLower().contains(#text(searchTerm.toLower()));
      }
    );
  };

  public shared ({ caller }) func addWaterLog(log : WaterLog) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add water logs");
    };

    let id = nextLogId;
    nextLogId += 1;
    let newLog = {
      id;
      timestamp = Time.now();
      temperature = log.temperature;
      ph = log.ph;
      ammonia = log.ammonia;
      nitrate = log.nitrate;
      notes = log.notes;
    };

    switch (waterLogs.get(caller)) {
      case (null) {
        let newList = List.fromArray<WaterLog>([newLog]);
        waterLogs.add(caller, newList);
      };
      case (?existingLogs) {
        existingLogs.add(newLog);
      };
    };
  };

  public query ({ caller }) func getWaterLogs(user : Principal) : async [WaterLog] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own water logs");
    };
    switch (waterLogs.get(user)) {
      case (null) { [] };
      case (?userLogs) { userLogs.toArray() };
    };
  };

  public shared ({ caller }) func addReminder(reminderType : Text, title : Text, description : Text, frequencyDays : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reminders");
    };

    let id = nextReminderId;
    nextReminderId += 1;
    let newReminder = {
      id;
      reminderType;
      title;
      description;
      frequencyDays;
      lastDone = 0;
      nextDue = Time.now() + (frequencyDays * 24 * 60 * 60 * 1000000000);
      enabled = true;
    };

    switch (reminders.get(caller)) {
      case (null) {
        let newList = List.fromArray<Reminder>([newReminder]);
        reminders.add(caller, newList);
      };
      case (?reminderList) {
        reminderList.add(newReminder);
      };
    };
    id;
  };

  public query ({ caller }) func getReminders(user : Principal) : async [Reminder] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own reminders");
    };
    switch (reminders.get(user)) {
      case (null) { [] };
      case (?userReminders) { userReminders.toArray() };
    };
  };

  public query ({ caller }) func checkCompatibility(fishNames : [Text]) : async {
    compatible : Bool;
    conflicts : [(Text, Text)];
  } {
    let conflicts = List.empty<(Text, Text)>();

    for (fish1 in fishNames.values()) {
      for (fish2 in fishNames.values()) {
        if (fish1 != fish2) {
          let incompatible = fishProfiles.values().toArray().any(
            func(profile) {
              profile.name == fish1 and profile.incompatibleWith.find(
              func(name) { name == fish2 }) != null
            }
          );
          if (incompatible) {
            conflicts.add((fish1, fish2));
          };
        };
      };
    };

    {
      compatible = conflicts.isEmpty();
      conflicts = conflicts.toArray();
    };
  };

  system func preupgrade() {
    let fishProfilesArray = fishProfiles.toArray();
    fishProfiles.clear();
    fishProfilesArray.forEach(func((id, profile)) { fishProfiles.add(id, profile) });
  };

  system func postupgrade() {
    if (fishProfiles.isEmpty()) {
      let initialFish = [
        {
          id = 1;
          name = "Neon Tetra";
          scientificName = "Paracheirodon innesi";
          habitat = "Amazon Basin";
          minTankSize = 40;
          maxTankSize = 80;
          minTemp = 22;
          maxTemp = 26;
          minPH = 6.0;
          maxPH = 7.0;
          diet = "Omnivore";
          compatibleWith = ["Guppy", "Corydoras Catfish"];
          incompatibleWith = ["Betta Fish"];
          plants = ["Java Moss", "Anubias"];
          substrate = "Fine Gravel";
          decorations = ["Driftwood"];
          filtration = "Gentle Filter";
          lighting = "Moderate";
        },
        {
          id = 2;
          name = "Betta Fish";
          scientificName = "Betta splendens";
          habitat = "Southeast Asia";
          minTankSize = 20;
          maxTankSize = 40;
          minTemp = 24;
          maxTemp = 30;
          minPH = 6.5;
          maxPH = 7.5;
          diet = "Carnivore";
          compatibleWith = [];
          incompatibleWith = ["Neon Tetra"];
          plants = ["Amazon Sword", "Floating Plants"];
          substrate = "Soft Sand";
          decorations = ["Caves"];
          filtration = "Gentle Filter";
          lighting = "Low";
        },
        {
          id = 3;
          name = "Goldfish";
          scientificName = "Carassius auratus";
          habitat = "Asia";
          minTankSize = 75;
          maxTankSize = 150;
          minTemp = 18;
          maxTemp = 24;
          minPH = 7.0;
          maxPH = 8.0;
          diet = "Omnivore";
          compatibleWith = ["Other Goldfish"];
          incompatibleWith = [];
          plants = ["Java Fern", "Anubias"];
          substrate = "Gravel";
          decorations = ["Rocks"];
          filtration = "Strong Filter";
          lighting = "Bright";
        },
        {
          id = 4;
          name = "Guppy";
          scientificName = "Poecilia reticulata";
          habitat = "South America";
          minTankSize = 40;
          maxTankSize = 80;
          minTemp = 22;
          maxTemp = 28;
          minPH = 6.8;
          maxPH = 7.8;
          diet = "Omnivore";
          compatibleWith = ["Neon Tetra", "Corydoras Catfish"];
          incompatibleWith = [];
          plants = ["Java Moss", "Hornwort"];
          substrate = "Fine Gravel";
          decorations = ["Hiding Spots"];
          filtration = "Gentle Filter";
          lighting = "Moderate";
        },
        {
          id = 5;
          name = "Angelfish";
          scientificName = "Pterophyllum scalare";
          habitat = "Amazon Basin";
          minTankSize = 75;
          maxTankSize = 150;
          minTemp = 24;
          maxTemp = 28;
          minPH = 6.5;
          maxPH = 7.5;
          diet = "Omnivore";
          compatibleWith = ["Corydoras Catfish"];
          incompatibleWith = ["Small Tetras"];
          plants = ["Amazon Sword", "Vallisneria"];
          substrate = "Sand";
          decorations = ["Vertical Structures"];
          filtration = "Moderate Filter";
          lighting = "Medium";
        },
        {
          id = 6;
          name = "Corydoras Catfish";
          scientificName = "Corydoras spp.";
          habitat = "South America";
          minTankSize = 40;
          maxTankSize = 80;
          minTemp = 22;
          maxTemp = 26;
          minPH = 6.0;
          maxPH = 7.0;
          diet = "Omnivore";
          compatibleWith = ["Neon Tetra", "Guppy"];
          incompatibleWith = [];
          plants = ["Java Fern", "Cryptocoryne"];
          substrate = "Soft Sand";
          decorations = ["Hiding Places"];
          filtration = "Gentle Filter";
          lighting = "Low";
        },
        {
          id = 7;
          name = "Zebra Danio";
          scientificName = "Danio rerio";
          habitat = "South Asia";
          minTankSize = 40;
          maxTankSize = 80;
          minTemp = 18;
          maxTemp = 24;
          minPH = 6.5;
          maxPH = 7.5;
          diet = "Omnivore";
          compatibleWith = ["Guppy", "Neon Tetra"];
          incompatibleWith = [];
          plants = ["Java Moss", "Hornwort"];
          substrate = "Gravel";
          decorations = ["Rocks"];
          filtration = "Moderate Filter";
          lighting = "Bright";
        },
        {
          id = 8;
          name = "Molly Fish";
          scientificName = "Poecilia sphenops";
          habitat = "Central America";
          minTankSize = 40;
          maxTankSize = 80;
          minTemp = 24;
          maxTemp = 28;
          minPH = 7.0;
          maxPH = 8.5;
          diet = "Omnivore";
          compatibleWith = ["Guppy", "Platies"];
          incompatibleWith = [];
          plants = ["Anubias", "Java Fern"];
          substrate = "Gravel";
          decorations = ["Hiding Spots"];
          filtration = "Moderate Filter";
          lighting = "Moderate";
        },
        {
          id = 9;
          name = "Cherry Barb";
          scientificName = "Puntius titteya";
          habitat = "Sri Lanka";
          minTankSize = 40;
          maxTankSize = 80;
          minTemp = 24;
          maxTemp = 27;
          minPH = 6.0;
          maxPH = 7.5;
          diet = "Omnivore";
          compatibleWith = ["Tetras", "Guppies"];
          incompatibleWith = [];
          plants = ["Java Moss", "Amazon Sword"];
          substrate = "Gravel";
          decorations = ["Plants"];
          filtration = "Gentle Filter";
          lighting = "Soft";
        },
        {
          id = 10;
          name = "Plecostomus";
          scientificName = "Hypostomus plecostomus";
          habitat = "South America";
          minTankSize = 75;
          maxTankSize = 150;
          minTemp = 22;
          maxTemp = 30;
          minPH = 6.5;
          maxPH = 7.5;
          diet = "Herbivore";
          compatibleWith = ["Most Community Fish"];
          incompatibleWith = [];
          plants = ["Java Fern", "Anubias"];
          substrate = "Sand or Gravel";
          decorations = ["Rocks", "Driftwood"];
          filtration = "Strong Filter";
          lighting = "Low to Moderate";
        },
      ];

      for (fish in initialFish.values()) {
        fishProfiles.add(fish.id, fish);
      };
      nextFishId := 11;
    };
  };
};
