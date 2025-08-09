import { Router } from "express"

import { HelperControllers } from "../controllers/helper.contoller"

const router = Router()

const helperController = new HelperControllers()

router.get('/', helperController.getAllHelpers)
router.post('/', helperController.createHelper)
router.get('/:id', helperController.getHelperById)
router.delete('/:id', helperController.deleteHelper)
router.put('/:id', helperController.updateHelper)
router.post('/getByFilter', helperController.getHelpersByFilters)

export default router

