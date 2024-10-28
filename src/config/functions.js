import { addDoc, and, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { db } from "./firebase"


async function AddValue(dbName, data) {

    return new Promise(async (resolve, reject) => {
        await addDoc(collection(db, dbName), data)
            .then((data) => {
                resolve({ type: true, message: "Data Added", data: data })
            }).catch((e) => {
                resolve({ type: false, message: e.message })
            })
    })

}

async function UpdateValue(dbName, dbId, data) {

    return new Promise(async (resolve, reject) => {
        await updateDoc(doc(db, dbName, dbId), data)
            .then(() => {
                resolve({ type: true, message: "Data Updated" })
            }).catch((e) => {
                resolve({ type: false, message: e.message })
            })
    })
}

async function DeleteValue(dbName, dbId,) {
    return new Promise(async (resolve, reject) => {
        await deleteDoc(doc(db, dbName, dbId))
            .then(() => {
                resolve({ type: true, message: "Data Deleted" })
            }).catch((e) => {
                resolve({ type: false, message: e.message })
            })
    })
}

async function GetValueAll(dbName, startdate, enddate, bank, account) {
    return new Promise(async (resolve, reject) => {
        if (startdate) {
            await getDocs(query(collection(db, dbName), and(where("date", ">=", startdate), where("date", "<=", enddate), where("name", '==', bank), where("account", "==", account))))
                .then((snapshot) => {
                    let list = []
                    snapshot.forEach((docs) => {
                        list.push({ ...docs.data(), id: docs.id })
                    })
                    resolve({ type: true, data: list })
                }).catch((e) => {
                    resolve({ type: false, message: e.message })
                })
        } else {
            await getDocs(collection(db, dbName))
                .then((snapshot) => {
                    let list = []
                    snapshot.forEach((docs) => {
                        list.push({ ...docs.data(), id: docs.id })
                    })
                    resolve({ type: true, data: list })
                }).catch((e) => {
                    resolve({ type: false, message: e.message })
                })
        }

    })
}

export { AddValue, UpdateValue, DeleteValue, GetValueAll }