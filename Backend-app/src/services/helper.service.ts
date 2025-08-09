import Helper from "../models/helper.model";
import generateQRCode from "../utils/generateQR";

export interface IHelper {
    name: string;
    profilePic?: string;
    email: string;
    gender: string;
    phone: string;
    service: string;
    organization: string;
    languages: string[];
    households?: number | null;
    employeeId_QR: string;
    employeeID: number;
    vehicleType: string;
    kycDocx: string;
    additonalDocx?: string[];
    dateJoined?: Date | string;
}


export class HelperServices {
    async getAllHelpers(): Promise<IHelper[]> {
        const helpers: IHelper[] = await Helper.find()
        const sortedHelpers = [...helpers].sort((a, b) => {
            const h1 = a['name']?.toString().toLowerCase();
            const h2 = b['name']?.toString().toLowerCase();
            return h1.localeCompare(h2);
        })
        return sortedHelpers;
    }

    async getHelpersByFilters(payload: any): Promise<IHelper[]> {
        const { services, orgs, searchVal } = payload

        const filter = []
        if (services.length > 0) filter.push({ service: { $in: services } })
        if (orgs.length > 0) filter.push({ organization: { $in: orgs } })
        filter.push({ name: { $regex: searchVal, $options: 'i' } });
        const helpers = await Helper.aggregate([{ $match: { $and: filter } }])
        const sortedHelpers = [...helpers].sort((a, b) => {
            const h1 = a['name']?.toString().toLowerCase();
            const h2 = b['name']?.toString().toLowerCase();
            return h1.localeCompare(h2);
        })
        return sortedHelpers
    }

    async getHelperById(id: string): Promise<IHelper | null> {
        const helper = await Helper.findById(id);
        return helper
    }

    async createHelper(helper: IHelper): Promise<IHelper> {
        console.log(helper);

        const emp = await Helper.findOne()
            .sort({ employeeID: -1 })
            .select('employeeID');
        const employeeID = emp?.employeeID as number;
        helper.employeeID = employeeID + 1

        await generateQRCode(helper).then((qr) => {
            helper.employeeId_QR = qr
        })

        helper.dateJoined = new Date()

        const newHelper: IHelper = await new Helper(helper).save()
        return newHelper;
    }

    async deleteHelper(id: string) {
        await Helper.findByIdAndDelete(id)
    }

    async updateHelper(id: string, helper: IHelper) {
        await Helper.findByIdAndUpdate(id, helper)
    }
}