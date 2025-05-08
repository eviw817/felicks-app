// context/AdoptionProfileContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AdoptionProfileData {
  housingType: string | null;
  garden: string | null;
  environment: string | null;
  livingSituation: string | null;
  hasChildren: string | null;
  childrenAges: number[];
  hasPets: string | null;
  pets: string[];
  workHours: string | null;
  workFromHome: string | null;
  petTime: string | null;
  timeWithDog: string | null;
  weekendRoutine: string | null;
  experience: string | null;
  petsOwned: string[];
  preferredAge: string | null;
  preferences: string[];
  preferredSize: string | null;
  activity_level: string | null;
  breed_pref: string | null;
  motivation: string;
}

const defaultProfileData: AdoptionProfileData = {
  housingType: null,
  garden: null,
  environment: null,
  livingSituation: null,
  hasChildren: null,
  childrenAges: [],
  hasPets: null,
  pets: [],
  workHours: null,
  workFromHome: null,
  petTime: null,
  timeWithDog: null,
  weekendRoutine: null,
  experience: null,
  petsOwned: [],
  preferredAge: null,
  preferences: [],
  preferredSize: null,
  activity_level: null,
  breed_pref: null,
  motivation: "",
};

const AdoptionProfileContext = createContext({
  profileData: defaultProfileData,
  updateProfile: (data: Partial<AdoptionProfileData>) => {},
  resetProfile: () => {},
});

export const AdoptionProfileProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [profileData, setProfileData] =
    useState<AdoptionProfileData>(defaultProfileData);

  const updateProfile = (data: Partial<AdoptionProfileData>) => {
    setProfileData((prev) => ({ ...prev, ...data }));
  };

  const resetProfile = () => {
    setProfileData(defaultProfileData);
  };

  return (
    <AdoptionProfileContext.Provider
      value={{ profileData, updateProfile, resetProfile }}
    >
      {children}
    </AdoptionProfileContext.Provider>
  );
};

export const useAdoptionProfile = () => useContext(AdoptionProfileContext);
