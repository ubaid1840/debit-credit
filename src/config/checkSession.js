import { app, auth, db } from "@/config/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function useCheckSession() {
    const router = useRouter();
    const pathname = usePathname()

    const checkSession = async () => {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, async user => {
                if (user) {
                    if (pathname.includes('login') || pathname.includes('signup') || pathname.includes('forgetpassword')) {
                        router.push('/dashboard')
                    }
                    if(user.email){
                        if(user.email !== "superadmin@gmail.com"){
                            getDocs(query(collection(db, "users"), where("email", "==", user.email)))
                            .then((snapshot)=>{
                                let list = []
                                snapshot.forEach((docs)=>{
                                    list.push({...docs.data(), id : docs.id})
                                })
                                if(list.length > 0){
                                    resolve({...user, ...list[0]})
                                }
                               
                            })
                        } else {
                            resolve({email : user.email})
                        }
                       
                    }

                } else {
                    if (pathname.includes('superadmin') || pathname.includes('dashboard')) {
                        router.push('/login')
                    }
                    resolve({})
                }
            })
            return () => {
                unsubscribe()
            }
        })
    };

    return checkSession;
}