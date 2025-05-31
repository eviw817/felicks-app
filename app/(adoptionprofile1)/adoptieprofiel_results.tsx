// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   Platform,
//   ActivityIndicator,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { supabase } from "../../lib/supabase";
// import { Ionicons } from "@expo/vector-icons";

// // Voeg has_garden toe aan Prefs
// interface Prefs {
//   living_situation: string;
//   home_frequency: string;
//   experience_level: string;
//   preferred_size: string;
//   good_with_children: boolean;
//   good_with_pets: boolean;
//   activity_level: string;
//   personality_type: string;
//   barking: string;
//   training: string;
//   grooming: string;
//   shedding: string;
//   has_garden: boolean | null;
// }

// interface Breed {
//   id: number;
//   name: string;
//   // image: string;
//   size: string;
//   activity_level: string;
//   good_with_children: boolean;
//   good_with_pets: boolean;
//   shedding: string;
//   barking: string;
//   training: string;
//   grooming: string;
//   needs_garden: boolean;
//   experience: boolean;
// }

// export default function AdoptieProfielResults() {
//   const router = useRouter();
//   const [prefs, setPrefs] = useState<Prefs | null>(null);
//   const [breeds, setBreeds] = useState<Breed[]>([]);
//   const [matches, setMatches] = useState<{ breed: Breed; score: number }[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return;

//       const { data: p, error: perr } = await supabase
//         .from("profiles_breed_matches")
//         .select(
//           `living_situation, home_frequency, experience_level, preferred_size,
//            good_with_children, good_with_pets, activity_level,
//            personality_type, barking, training, grooming, shedding, has_garden`
//         )
//         .eq("user_id", user.id)
//         .single();
//       if (perr || !p) {
//         console.error("Error fetching prefs:", perr);
//         setLoading(false);
//         return;
//       }
//       setPrefs(p as Prefs);

//       // const { data: b, error: berr } = await supabase.from("dog_breeds").select(
//       //   `id, name, image, size, activity_level, good_with_children,
//       //      good_with_pets, shedding, barking, training, grooming,
//       //      needs_garden, experience`
//       // );
//       const { data: b, error: berr } = await supabase.from("dog_breeds").select(
//         `id, name, size, activity_level, good_with_children,
//            good_with_pets, shedding, barking, training, grooming,
//            needs_garden, experience`
//       );
//       if (berr || !b) {
//         console.error("Error fetching breeds:", berr);
//         setLoading(false);
//         return;
//       }
//       setBreeds(b as Breed[]);
//       setLoading(false);
//     })();
//   }, []);

//   useEffect(() => {
//     if (!prefs || breeds.length === 0) return;

//     const criteria: {
//       pref: keyof Prefs;
//       breed: keyof Breed;
//       type: "equal" | "bool";
//     }[] = [
//       { pref: "experience_level", breed: "experience", type: "equal" },
//       { pref: "preferred_size", breed: "size", type: "equal" },
//       { pref: "good_with_children", breed: "good_with_children", type: "bool" },
//       { pref: "good_with_pets", breed: "good_with_pets", type: "bool" },
//       { pref: "activity_level", breed: "activity_level", type: "equal" },
//       { pref: "barking", breed: "barking", type: "equal" },
//       { pref: "training", breed: "training", type: "equal" },
//       { pref: "grooming", breed: "grooming", type: "equal" },
//       { pref: "shedding", breed: "shedding", type: "equal" },
//       { pref: "has_garden", breed: "needs_garden", type: "bool" },
//     ];

//     const scored = breeds.map((breed) => {
//       let matchCount = 0;
//       criteria.forEach((c) => {
//         const pv = prefs[c.pref];
//         const bv = breed[c.breed];
//         if (c.type === "bool") {
//           if (Boolean(pv) === Boolean(bv)) matchCount++;
//         } else {
//           if (pv === bv) matchCount++;
//         }
//       });
//       return { breed, score: matchCount / criteria.length };
//     });

//     setMatches(
//       scored.filter((r) => r.score >= 0.3).sort((a, b) => b.score - a.score)
//     );
//   }, [prefs, breeds]);

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ActivityIndicator size="large" color="#97B8A5" />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <TouchableOpacity
//         style={styles.back}
//         onPress={() => router.push("/startpage/startpage")}
//       >
//         <Ionicons name="arrow-back" size={24} color="#183A36" />
//       </TouchableOpacity>

//       <Text style={styles.title}>Geschikte honden</Text>
//       <Text style={styles.subtitle}>Alle rassen ≥ 60% match</Text>

//       {matches.length === 0 ? (
//         <Text style={styles.noMatch}>Geen rassen boven de 60% gevonden.</Text>
//       ) : (
//         <FlatList
//           data={matches}
//           keyExtractor={(item) => item.breed.id.toString()}
//           numColumns={2}
//           contentContainerStyle={styles.list}
//           renderItem={({ item }) => (
//             <View style={styles.card}>
//               {/* s<Image source={{ uri: item.breed.image }} style={styles.image} /> */}
//               <Text style={styles.breedName}>{item.breed.name}</Text>
//               <Text style={styles.score}>{Math.round(item.score * 100)}%</Text>
//             </View>
//           )}
//         />
//       )}

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => router.push("/startpage/startpage")}
//       >
//         <Text style={styles.buttonText}>NAAR HOME</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8F8F8",
//     paddingHorizontal: 16,
//     paddingTop: Platform.OS === "ios" ? 20 : 50,
//   },
//   back: { paddingVertical: 8 },
//   title: {
//     fontFamily: "Nunito-Bold",
//     fontSize: 20,
//     color: "#183A36",
//     textAlign: "center",
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontFamily: "Nunito-Regular",
//     fontSize: 16,
//     color: "#183A36",
//     textAlign: "center",
//     marginBottom: 12,
//   },
//   noMatch: {
//     fontFamily: "Nunito-Regular",
//     fontSize: 16,
//     color: "#183A36",
//     textAlign: "center",
//     marginTop: 40,
//   },
//   list: {
//     alignItems: "center",
//     paddingBottom: 24,
//   },
//   card: {
//     flex: 1,
//     alignItems: "center",
//     margin: 8,
//   },
//   image: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginBottom: 8,
//   },
//   breedName: {
//     fontFamily: "Nunito-Bold",
//     fontSize: 14,
//     color: "#183A36",
//     textAlign: "center",
//   },
//   score: {
//     fontFamily: "Nunito-Regular",
//     fontSize: 12,
//     color: "#97B8A5",
//     marginTop: 4,
//   },
//   button: {
//     backgroundColor: "#97B8A5",
//     paddingVertical: 14,
//     borderRadius: 25,
//     alignItems: "center",
//     marginTop: "auto",
//     marginBottom: 16,
//   },
//   buttonText: {
//     fontFamily: "Nunito-Bold",
//     fontSize: 16,
//     color: "#183A36",
//   },
// });
