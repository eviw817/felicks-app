// context/AdoptionProfileContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AdoptionprofileData {
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

const defaultProfileData: AdoptionprofileData = {
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

const AdoptionprofileContext = createContext({
  profileData: defaultProfileData,
  updateProfile: (data: Partial<AdoptionprofileData>) => {},
  resetProfile: () => {},
});

export const AdoptionprofileProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [profileData, setProfileData] =
    useState<AdoptionprofileData>(defaultProfileData);

  const updateProfile = (data: Partial<AdoptionprofileData>) => {
    setProfileData((prev) => ({ ...prev, ...data }));
  };

  const resetProfile = () => {
    setProfileData(defaultProfileData);
  };

  return (
    <AdoptionprofileContext.Provider
      value={{ profileData, updateProfile, resetProfile }}
    >
      {children}
    </AdoptionprofileContext.Provider>
  );
};

export const useAdoptionprofile = () => useContext(AdoptionprofileContext);
