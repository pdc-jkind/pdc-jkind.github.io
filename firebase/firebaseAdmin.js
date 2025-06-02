// // Tambahan fungsi untuk FirebaseAuthHandler class yang sudah ada

// // Import tambahan yang diperlukan
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   doc,
//   setDoc,
//   getDoc,
//   updateDoc,
//   query,
//   orderBy,
//   where,
//   serverTimestamp,
//   writeBatch,
//   deleteDoc
// } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// // Tambahkan fungsi-fungsi ini ke dalam class FirebaseAuthHandler

// // 1. Set user role dan district (menggunakan Firestore)
// async setUserClaims(uid, role, district = null) {
//   try {
//     if (!uid || !role) {
//       return {
//         success: false,
//         message: 'User ID dan role wajib diisi'
//       };
//     }

//     // Validasi role yang diperbolehkan
//     const validRoles = ['user', 'admin', 'moderator', 'editor'];
//     if (!validRoles.includes(role)) {
//       return {
//         success: false,
//         message: `Role tidak valid. Role yang diperbolehkan: ${validRoles.join(', ')}`
//       };
//     }

//     // Validasi apakah user yang sedang login memiliki hak untuk mengubah role
//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       return {
//         success: false,
//         message: 'Anda harus login terlebih dahulu'
//       };
//     }

//     // Cek apakah user yang sedang login adalah admin
//     const currentUserRole = await this.getUserRole(currentUser.uid);
//     if (!currentUserRole.success || currentUserRole.role !== 'admin') {
//       return {
//         success: false,
//         message: 'Hanya admin yang dapat mengubah role user'
//       };
//     }

//     const userRef = doc(this.db, 'users', uid);
//     const userDoc = await getDoc(userRef);

//     if (!userDoc.exists()) {
//       return {
//         success: false,
//         message: 'User tidak ditemukan'
//       };
//     }

//     const updateData = {
//       role: role,
//       updatedAt: serverTimestamp(),
//       roleUpdatedBy: currentUser.uid
//     };

//     if (district) {
//       updateData.district = district;
//     }

//     await updateDoc(userRef, updateData);

//     console.log(`Role: ${role}${district ? ` dan district: ${district}` : ''} berhasil ditambahkan ke user ${uid}`);

//     return {
//       success: true,
//       message: `Role berhasil diset untuk user ${uid}`,
//       data: {
//         uid: uid,
//         role: role,
//         district: district
//       }
//     };

//   } catch (error) {
//     console.error('Error setting user claims:', error);
//     return {
//       success: false,
//       error: error.message,
//       message: 'Gagal mengatur user role'
//     };
//   }
// }

// // 2. Get user role dan district dari Firestore
// async getUserClaims(uid) {
//   try {
//     if (!uid) {
//       return {
//         success: false,
//         message: 'User ID wajib diisi'
//       };
//     }

//     const userRef = doc(this.db, 'users', uid);
//     const userDoc = await getDoc(userRef);

//     if (!userDoc.exists()) {
//       return {
//         success: false,
//         message: 'User tidak ditemukan'
//       };
//     }

//     const userData = userDoc.data();
//     const claims = {
//       role: userData.role || 'user',
//       district: userData.district || null
//     };

//     return {
//       success: true,
//       claims: claims,
//       userData: userData
//     };

//   } catch (error) {
//     console.error('Error getting user claims:', error);
//     return {
//       success: false,
//       error: error.message,
//       message: 'Gagal mengambil user claims'
//     };
//   }
// }

// // 3. Remove user district (set district ke null)
// async removeUserDistrict(uid) {
//   try {
//     if (!uid) {
//       return {
//         success: false,
//         message: 'User ID wajib diisi'
//       };
//     }

//     // Validasi admin access
//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       return {
//         success: false,
//         message: 'Anda harus login terlebih dahulu'
//       };
//     }

//     const currentUserRole = await this.getUserRole(currentUser.uid);
//     if (!currentUserRole.success || currentUserRole.role !== 'admin') {
//       return {
//         success: false,
//         message: 'Hanya admin yang dapat mengubah district user'
//       };
//     }

//     const userRef = doc(this.db, 'users', uid);
//     await updateDoc(userRef, {
//       district: null,
//       updatedAt: serverTimestamp(),
//       roleUpdatedBy: currentUser.uid
//     });

//     return {
//       success: true,
//       message: `District berhasil dihapus untuk user ${uid}`
//     };

//   } catch (error) {
//     console.error('Error removing user district:', error);
//     return {
//       success: false,
//       error: error.message,
//       message: 'Gagal menghapus district user'
//     };
//   }
// }

// // 4. Batch set claims untuk multiple users
// async batchSetUserClaims(userClaimsArray) {
//   try {
//     // Validasi admin access
//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       return {
//         success: false,
//         message: 'Anda harus login terlebih dahulu'
//       };
//     }

//     const currentUserRole = await this.getUserRole(currentUser.uid);
//     if (!currentUserRole.success || currentUserRole.role !== 'admin') {
//       return {
//         success: false,
//         message: 'Hanya admin yang dapat melakukan batch update'
//       };
//     }

//     const batch = writeBatch(this.db);
//     const results = [];

//     for (const userClaim of userClaimsArray) {
//       const { uid, role, district } = userClaim;

//       // Validasi setiap entry
//       if (!uid || !role) {
//         results.push({
//           uid: uid || 'unknown',
//           success: false,
//           message: 'UID dan role wajib diisi'
//         });
//         continue;
//       }

//       const validRoles = ['user', 'admin', 'moderator', 'editor'];
//       if (!validRoles.includes(role)) {
//         results.push({
//           uid: uid,
//           success: false,
//           message: 'Role tidak valid'
//         });
//         continue;
//       }

//       const userRef = doc(this.db, 'users', uid);
//       const updateData = {
//         role: role,
//         updatedAt: serverTimestamp(),
//         roleUpdatedBy: currentUser.uid
//       };

//       if (district) {
//         updateData.district = district;
//       }

//       batch.update(userRef, updateData);
//       results.push({
//         uid: uid,
//         success: true,
//         message: 'Berhasil ditambahkan ke batch'
//       });
//     }

//     // Commit batch
//     await batch.commit();

//     const successCount = results.filter(r => r.success).length;
//     const failCount = results.length - successCount;

//     return {
//       success: failCount === 0,
//       message: `Batch update selesai. Berhasil: ${successCount}, Gagal: ${failCount}`,
//       results: results,
//       summary: {
//         total: results.length,
//         success: successCount,
//         failed: failCount
//       }
//     };

//   } catch (error) {
//     console.error('Error batch setting claims:', error);
//     return {
//       success: false,
//       error: error.message,
//       message: 'Gagal melakukan batch update claims'
//     };
//   }
// }

// // 5. Get users by role
// async getUsersByRole(role, limit = 50) {
//   try {
//     const usersRef = collection(this.db, 'users');
//     const q = query(
//       usersRef,
//       where('role', '==', role),
//       orderBy('createdAt', 'desc')
//     );

//     if (limit) {
//       q = query(q, limit(limit));
//     }

//     const querySnapshot = await getDocs(q);
//     const users = [];

//     querySnapshot.forEach((doc) => {
//       const userData = doc.data();
//       users.push({
//         uid: doc.id,
//         email: userData.email,
//         displayName: userData.displayName || '',
//         role: userData.role,
//         district: userData.district,
//         isActive: userData.isActive,
//         createdAt: userData.createdAt,
//         lastLogin: userData.lastLogin
//       });
//     });

//     return {
//       success: true,
//       users: users,
//       count: users.length,
//       message: `Ditemukan ${users.length} user dengan role ${role}`
//     };

//   } catch (error) {
//     console.error('Error getting users by role:', error);
//     return {
//       success: false,
//       error: error.message,
//       message: 'Gagal mengambil user berdasarkan role'
//     };
//   }
// }

// // 6. Get users by district
// async getUsersByDistrict(district, limit = 50) {
//   try {
//     const usersRef = collection(this.db, 'users');
//     const q = query(
//       usersRef,
//       where('district', '==', district),
//       orderBy('createdAt', 'desc')
//     );

//     if (limit) {
//       q = query(q, limit(limit));
//     }

//     const querySnapshot = await getDocs(q);
//     const users = [];

//     querySnapshot.forEach((doc) => {
//       const userData = doc.data();
//       users.push({
//         uid: doc.id,
//         email: userData.email,
//         displayName: userData.displayName || '',
//         role: userData.role,
//         district: userData.district,
//         isActive: userData.isActive,
//         createdAt: userData.createdAt,
//         lastLogin: userData.lastLogin
//       });
//     });

//     return {
//       success: true,
//       users: users,
//       count: users.length,
//       message: `Ditemukan ${users.length} user di district ${district}`
//     };

//   } catch (error) {
//     console.error('Error getting users by district:', error);
//     return {
//       success: false,
//       error: error.message,
//       message: 'Gagal mengambil user berdasarkan district'
//     };
//   }
// }

// // 7. Verify user claims (untuk middleware/guard)
// async verifyUserClaims(uid, requiredRole = null, requiredDistrict = null) {
//   try {
//     const claimsResult = await this.getUserClaims(uid);
//     if (!claimsResult.success) {
//       return claimsResult;
//     }

//     const claims = claimsResult.claims;
//     const roleHierarchy = {
//       'user': 1,
//       'editor': 2,
//       'moderator': 3,
//       'admin': 4
//     };

//     let hasRequiredRole = true;
//     let hasRequiredDistrict = true;

//     // Check role
//     if (requiredRole) {
//       const userRoleLevel = roleHierarchy[claims.role] || 0;
//       const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
//       hasRequiredRole = userRoleLevel >= requiredRoleLevel;
//     }

//     // Check district
//     if (requiredDistrict) {
//       hasRequiredDistrict = claims.district === requiredDistrict;
//     }

//     const isAuthorized = hasRequiredRole && hasRequiredDistrict;

//     return {
//       success: true,
//       authorized: isAuthorized,
//       userRole: claims.role,
//       userDistrict: claims.district,
//       message: isAuthorized ? 'User memiliki akses' : 'User tidak memiliki akses yang diperlukan'
//     };

//   } catch (error) {
//     console.error('Error verifying user claims:', error);
//     return {
//       success: false,
//       authorized: false,
//       error: error.message,
//       message: 'Gagal memverifikasi user claims'
//     };
//   }
// }

// // 8. Get current user role (shortcut)
// async getCurrentUserRole() {
//   try {
//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       return {
//         success: false,
//         message: 'User tidak login'
//       };
//     }

//     return await this.getUserClaims(currentUser.uid);
//   } catch (error) {
//     console.error('Error getting current user role:', error);
//     return {
//       success: false,
//       error: error.message,
//       message: 'Gagal mengambil role user saat ini'
//     };
//   }
// }

// // 9. Check if current user is admin
// async isCurrentUserAdmin() {
//   try {
//     const roleResult = await this.getCurrentUserRole();
//     return roleResult.success && roleResult.claims.role === 'admin';
//   } catch (error) {
//     console.error('Error checking admin status:', error);
//     return false;
//   }
// }

// // 10. Get all users with pagination
// async getAllUsersWithRoles(limit = 50, startAfter = null, roleFilter = null, districtFilter = null) {
//   try {
//     const usersRef = collection(this.db, 'users');
//     let q = query(usersRef, orderBy('createdAt', 'desc'));

//     // Add filters
//     if (roleFilter) {
//       q = query(q, where('role', '==', roleFilter));
//     }

//     if (districtFilter) {
//       q = query(q, where('district', '==', districtFilter));
//     }

//     // Add pagination
//     if (startAfter) {
//       q = query(q, startAfter(startAfter));
//     }

//     // Limit results
//     if (limit) {
//       q = query(q, limit(limit));
//     }

//     const querySnapshot = await getDocs(q);
//     const users = [];

//     querySnapshot.forEach((doc) => {
//       const userData = doc.data();
//       users.push({
//         uid: doc.id,
//         email: userData.email,
//         displayName: userData.displayName || '',
//         photoURL: userData.photoURL || '',
//         role: userData.role || 'user',
//         district: userData.district || null,
//         loginMethod: userData.loginMethod || 'unknown',
//         createdAt: userData.createdAt,
//         lastLogin: userData.lastLogin,
//         isActive: userData.isActive !== false,
//         roleUpdatedBy: userData.roleUpdatedBy || null
//       });
//     });

//     return {
//       success: true,
//       users: users,
//       count: users.length,
//       message: `Successfully retrieved ${users.length} users`
//     };

//   } catch (error) {
//     console.error('Error fetching users with roles:', error);
//     return {
//       success: false,
//       error: error.message,
//       message: 'Failed to fetch users'
//     };
//   }
// }

// // Usage examples:
// /*
// // 1. Set user claims (hanya admin yang bisa)
// const result = await authHandler.setUserClaims('y9hGJvJnXlewPIHJ9fcdoVBsxB23', 'admin', 'jakarta');
// console.log(result);

// // 2. Get user claims
// const claims = await authHandler.getUserClaims('y9hGJvJnXlewPIHJ9fcdoVBsxB23');
// console.log('User role:', claims.claims.role);
// console.log('User district:', claims.claims.district);

// // 3. Check if current user is admin
// const isAdmin = await authHandler.isCurrentUserAdmin();
// console.log('Is admin:', isAdmin);

// // 4. Get all admin users
// const admins = await authHandler.getUsersByRole('admin');
// console.log('Admin users:', admins.users);

// // 5. Get users by district
// const jakartaUsers = await authHandler.getUsersByDistrict('jakarta');
// console.log('Jakarta users:', jakartaUsers.users);

// // 6. Verify user access
// const hasAccess = await authHandler.verifyUserClaims('user-uid', 'moderator', 'jakarta');
// console.log('Has access:', hasAccess.authorized);

// // 7. Batch update roles
// const batchUpdates = [
//   { uid: 'user1', role: 'admin', district: 'jakarta' },
//   { uid: 'user2', role: 'moderator', district: 'bandung' }
// ];
// const batchResult = await authHandler.batchSetUserClaims(batchUpdates);
// console.log(batchResult);
// */