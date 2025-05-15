// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import { supabase } from "../../lib/supabase";

// export default function AllBreedsScreen() {
//   const [dogBreeds, setDogBreeds] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBreeds = async () => {
//       const { data, error } = await supabase.from("dog_breeds").select(`
//         id,
//         name,
//         size,
//         activity_level,
//         good_with_children,
//         good_with_pets,
//         shedding,
//         barking,
//         training,
//         grooming,
//         personality_type,
//         can_be_alone,
//         experience_required,
//       `);

//       if (error) {
//         console.error("❌ Error fetching breeds:", error);
//       } else {
//         console.log("✅ Breeds fetched:", data);
//         setDogBreeds(data);
//       }

//       setLoading(false);
//     };

//     fetchBreeds();
//   }, []);

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ActivityIndicator size="large" color="#97B8A5" />
//       </SafeAreaView>
//     );
//   }

//   const renderItem = ({ item }: { item: any }) => (
//     <View style={styles.card}>
//       <Text style={styles.name}>{item.name}</Text>
//       <Text style={styles.detail}>Size: {item.size}</Text>
//       <Text style={styles.detail}>Activity level: {item.activity_level}</Text>
//       <Text style={styles.detail}>
//         Good with children: {item.good_with_children ? "Yes" : "No"}
//       </Text>
//       <Text style={styles.detail}>
//         Good with pets: {item.good_with_pets ? "Yes" : "No"}
//       </Text>
//       <Text style={styles.detail}>Grooming: {item.grooming}</Text>
//       <Text style={styles.detail}>Shedding: {item.shedding}</Text>
//       <Text style={styles.detail}>Barking: {item.barking}</Text>
//       <Text style={styles.detail}>Training: {item.training}</Text>
//       <Text style={styles.detail}>Personality: {item.personality_type}</Text>
//       <Text style={styles.detail}>Can be alone: {item.can_be_alone}</Text>
//       <Text style={styles.detail}>
//         Experience required: {item.experience_required ? "Yes" : "No"}
//       </Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={dogBreeds}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 32 }}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8F8F8",
//     padding: 16,
//   },
//   card: {
//     backgroundColor: "white",
//     padding: 16,
//     marginBottom: 16,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 1 },
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   name: {
//     fontFamily: "Nunito-Bold",
//     fontSize: 18,
//     color: "#183A36",
//     marginBottom: 6,
//   },
//   detail: {
//     fontFamily: "Nunito-Regular",
//     fontSize: 14,
//     color: "#555",
//   },
// });
