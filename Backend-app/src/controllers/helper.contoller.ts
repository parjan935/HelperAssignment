import { HelperServices } from "../services/helper.service";
import { Request, Response } from 'express';

const helperService = new HelperServices();

export class HelperControllers {

    async getAllHelpers(req: Request, res: Response) {
        try {
            const helpers = await helperService.getAllHelpers();
            res.json(helpers)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async getHelpersByFilters(req: Request, res: Response) {
        const { services, orgs, serarhVal } = req.body
        try {
            const helpers = await helperService.getHelpersByFilters(req.body)
            res.json(helpers)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async getHelperById(req: Request, res: Response) {
        const id: string = req.params.id as string
        try {
            const helper = await helperService.getHelperById(id)
            if (helper) res.json(helper);
            else res.status(404).json({ message: "Helper Not Found" })
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async createHelper(req: Request, res: Response) {
        const helperData = req.body
        console.log(helperData);
        try {
            const newHelper = await helperService.createHelper(helperData)
            if (newHelper) res.json({ message: 'Helper added successfully!', helper: newHelper })
            else res.status(400).json({ message: 'error adding helper' })
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async deleteHelper(req: Request, res: Response) {
        const id: string = req.params.id as string
        try {
            await helperService.deleteHelper(id)
            res.json({ message: "Helper deleted successfully!" })
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async updateHelper(req: Request, res: Response) {
        const id: string = req.params.id as string
        const helper = req.body
        const old = await helperService.getHelperById(id)

        if (helper.profilePic === null || helper.name !== old?.name) {
            helper.profilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(helper.name)}&background=random&color=fff&rounded=true&length=2`;
        }
        try {
            await helperService.updateHelper(id, helper)
            res.json({ message: "Helper updated successfully!" })
        } catch (error) {
            res.status(500).json(error)
        }
    }
}