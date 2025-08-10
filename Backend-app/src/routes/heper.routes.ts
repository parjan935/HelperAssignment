import { Router } from "express"
import { HelperControllers } from "../controllers/helper.contoller"
import multer from "multer"

const router = Router()

const upload = multer({ storage: multer.memoryStorage() })

const helperController = new HelperControllers()

router.get('/', helperController.getAllHelpers)
router.post('/', upload.fields([
    { name: 'kycDocx', maxCount: 1 },
    { name: 'additionalDocx', maxCount: 1 }]),
    helperController.createHelper)
router.get('/:id', helperController.getHelperById)
router.delete('/:id', helperController.deleteHelper)
router.put('/:id', upload.fields([
    { name: 'kycDocx', maxCount: 1 },
    { name: 'additionalDocx', maxCount: 1 }]),
    helperController.updateHelper)

router.post('/getByFilter', helperController.getHelpersByFilters)

export default router

