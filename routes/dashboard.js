const express = require('express');
const router = express.Router();

const {fetchDataDashboard,chartOne,chartTwo,chartThree,
    EndpointTofetchCampingPostLocations

} = require ('../controllers/dashboardController.js')


router.get('/getAll',fetchDataDashboard)
router.get('/getchartOne',chartOne)
router.get('/getChartTwo',chartTwo)
router.get('/getChartThree',chartThree)
router.get('/getEndpointTofetchCampingPostLocations',EndpointTofetchCampingPostLocations)


module.exports = router;