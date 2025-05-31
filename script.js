
        const map = L.map('map', {
            zoomControl: false,
            attributionControl: false
        }).setView([7.0731, 125.6127], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        let userMarker = null;
        let watchId = null;
        let routeLayers = [];
        let walkingLayer = null;
        let savedRoutes = JSON.parse(localStorage.getItem('savedRoutes') || '[]');
        let history = JSON.parse(localStorage.getItem('history') || '[]');
        let currentFilter = 'routes';
        let activeRouteIndex = null;
        let userLocation = null;
        let routeDataStore = [];

        const jeepneyRoutes = [
            {
                name: "Eco land-SM",
                waypoints: [
                    [7.046145, 125.591361], [7.051762, 125.590041], [7.051304, 125.588983], [7.050282, 125.586214],
                    [7.049526, 125.585994], [7.045809, 125.589556], [7.046816, 125.594183], [7.047290, 125.594977],
                    [7.053827, 125.598822], [7.054562, 125.601790], [7.057857, 125.601198], [7.059060, 125.601305],
                    [7.060035, 125.601568], [7.063612, 125.600725], [7.064677, 125.601654], [7.067488, 125.602255],
                    [7.068212, 125.602818], [7.064831, 125.606514], [7.063841, 125.608108], [7.073615, 125.612512],
                    [7.074329, 125.624845], [7.056851, 125.601410]
                ],
                stops: ["Ecoland Terminal", "Bolton Bridge", "San Pedro St", "SM City Davao"],
                image: "https://ph.commutetour.com/wp-content/uploads/Ecoland-SM.jpg"
            },
            {
                name: "ROUTE 1",
                waypoints: [
                    [7.065907, 125.610360], [7.073599, 125.612512], [7.069399, 125.619915], [7.071566, 125.621734],
                    [7.073828, 125.624588], [7.077518, 125.617462], [7.081595, 125.615476], [7.076767, 125.616045],
                    [7.073344, 125.610879], [7.068207, 125.609479], [7.065215, 125.608349], [7.069937, 125.604878],
                    [7.074095, 125.609241], [7.074898, 125.609804], [7.078540, 125.606906], [7.079588, 125.604018],
                    [7.077523, 125.602183], [7.076676, 125.602416], [7.071656, 125.605053], [7.064778, 125.606569],
                    [7.064059, 125.607680], [7.063357, 125.608919], [7.065901, 125.610358]
                ],
                stops: ["Claveria", "R. Castillo", "Agdao", "Cabaguio"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "ROUTE 2",
                waypoints: [
                    [7.054283, 125.600771], [7.056812, 125.601453], [7.057435, 125.601560], [7.059186, 125.607923],
                    [7.061903, 125.610207], [7.063405, 125.612031], [7.063956, 125.613458], [7.069687, 125.620051],
                    [7.070910, 125.620937], [7.074314, 125.624922], [7.073519, 125.610959], [7.068099, 125.609457],
                    [7.069729, 125.602474], [7.067960, 125.600844], [7.066202, 125.601831], [7.063727, 125.600688],
                    [7.060375, 125.601488], [7.059579, 125.601492], [7.057986, 125.601197], [7.056740, 125.601465]
                ],
                stops: ["Buhangin", "Bajada", "Abreeza Mall", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "ROUTE 3",
                waypoints: [
                    [7.073806, 125.616480], [7.072379, 125.616694], [7.067533, 125.617810], [7.069174, 125.619800],
                    [7.073849, 125.624591], [7.074179, 125.621887], [7.077422, 125.617418], [7.081569, 125.615450],
                    [7.079279, 125.614092], [7.073867, 125.616463], [7.073531, 125.610981], [7.066712, 125.609082],
                    [7.068245, 125.604356], [7.073224, 125.605246], [7.076585, 125.602473], [7.080042, 125.603519],
                    [7.078546, 125.606915], [7.073824, 125.609114], [7.069006, 125.607306], [7.064718, 125.606652],
                    [7.073542, 125.612499], [7.073769, 125.615509], [7.073796, 125.616485]
                ],
                stops: ["Matina Aplaya", "SM Ecoland", "San Pedro St", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "ROUTE 4",
                waypoints: [
                    [7.064116, 125.609879], [7.073671, 125.612529], [7.083716, 125.612368], [7.090766, 125.609952],
                    [7.092418, 125.610918], [7.095078, 125.615125], [7.097544, 125.620156], [7.086773, 125.623998],
                    [7.085341, 125.624232], [7.081549, 125.624581], [7.074983, 125.625134], [7.071130, 125.621067],
                    [7.069531, 125.619887], [7.066946, 125.616968], [7.064315, 125.613813], [7.063929, 125.613035],
                    [7.063604, 125.612224], [7.062965, 125.611162], [7.064030, 125.609836], [7.067669, 125.610821],
                    [7.076558, 125.613377], [7.087384, 125.610284], [7.064121, 125.609874]
                ],
                stops: ["Toril", "SM Ecoland", "San Pedro St", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "ROUTE 5",
                waypoints: [
                    [7.082161, 125.624371], [7.080901, 125.622842], [7.079287, 125.622724], [7.075644, 125.622939],
                    [7.081568, 125.615467], [7.076796, 125.616034], [7.073888, 125.616458], [7.073665, 125.613325],
                    [7.063148, 125.609576], [7.064719, 125.606626], [7.067567, 125.603535], [7.066923, 125.601497],
                    [7.069725, 125.602516], [7.064964, 125.608605], [7.063558, 125.612343], [7.069708, 125.620089],
                    [7.073759, 125.624488], [7.075138, 125.625217], [7.081733, 125.624692], [7.075459, 125.619634],
                    [7.080429, 125.614108], [7.066237, 125.604990], [7.067322, 125.601599], [7.082191, 125.624338]
                ],
                stops: ["Mintal", "SM Ecoland", "San Pedro St", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "Route 6",
                waypoints: [
                    [7.064783, 125.608816], [7.069692, 125.602516], [7.067350, 125.601604], [7.066695, 125.601523],
                    [7.066498, 125.602421], [7.067562, 125.603510], [7.063735, 125.608302], [7.063165, 125.609585],
                    [7.062659, 125.610149], [7.063809, 125.613009], [7.066631, 125.616744], [7.069628, 125.620028],
                    [7.070959, 125.620973], [7.074824, 125.625191], [7.081335, 125.624676], [7.080813, 125.622631],
                    [7.074329, 125.624831], [7.073520, 125.611193], [7.067834, 125.610189], [7.067515, 125.605275],
                    [7.064214, 125.613836], [7.078912, 125.624859], [7.075074, 125.625153], [7.064789, 125.608821]
                ],
                stops: ["Bunawan", "Buhangin", "Bajada", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "BAGO APLAYA",
                waypoints: [
                    [7.043707, 125.530935], [7.051353, 125.542061], [7.060063, 125.552051], [7.061488, 125.562382],
                    [7.055616, 125.575896], [7.055914, 125.577167], [7.058667, 125.580769], [7.061738, 125.593055],
                    [7.063985, 125.601205], [7.067408, 125.602241], [7.064853, 125.608827], [7.068175, 125.609470],
                    [7.073541, 125.611192], [7.064235, 125.613686], [7.060913, 125.609442], [7.058523, 125.606989],
                    [7.057187, 125.600880], [7.053747, 125.598352], [7.051767, 125.590060], [7.049770, 125.583936],
                    [7.055781, 125.577731], [7.050777, 125.541345], [7.059802, 125.551096], [7.050196, 125.582937]
                ],
                stops: ["Bago Aplaya", "SM Ecoland", "San Pedro St", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "BANKAL",
                waypoints: [
                    [7.060365, 125.553760], [7.061685, 125.561609], [7.059369, 125.567261], [7.055557, 125.576103],
                    [7.050526, 125.582590], [7.051650, 125.589665], [7.053838, 125.598677], [7.057133, 125.600823],
                    [7.058081, 125.605976], [7.060839, 125.609502], [7.073578, 125.612485], [7.074323, 125.624862],
                    [7.075638, 125.622919], [7.073498, 125.611218], [7.067062, 125.607656], [7.068920, 125.603480],
                    [7.064688, 125.601511], [7.061328, 125.591117], [7.059625, 125.583666], [7.058336, 125.580183],
                    [7.056005, 125.577182], [7.058768, 125.568796], [7.052597, 125.593594], [7.073849, 125.616747]
                ],
                stops: ["Bangkal", "SM Ecoland", "San Pedro St", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "BO. OBRERO",
                waypoints: [
                    [7.073541, 125.612571], [7.067541, 125.617797], [7.064123, 125.613575], [7.062989, 125.611140],
                   , [7.082793, 125.612522], [7.086025, 125.617909], [7.088601, 125.615783],
                    [7.086599, 125.613341], [7.087803, 125.613545], [7.084023, 125.615466], [7.076591, 125.613305],
                    [7.075468, 125.611588], [7.074600, 125.611261], [7.073333, 125.610896], [7.073546, 125.612565],
                    [7.076602, 125.613402], [7.083033, 125.614255], [7.087009, 125.613003], [7.087904, 125.612247],
                    [7.075372, 125.611202], [7.073621, 125.612452]
                ],
                stops: ["Bo. Obrero", "R. Castillo", "San Pedro St", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "BUHANGIN VIA DACUDAO",
                waypoints: [
                    [7.114382, 125.622950], [7.110395, 125.617361], [7.108675, 125.613330], [7.100839, 125.614696],
                    [7.095740, 125.615082], [7.093610, 125.616177], [7.086610, 125.621523], [7.088218, 125.623498],
                    [7.085173, 125.624249], [7.081547, 125.624560], [7.075665, 125.625113], [7.074105, 125.620815],
                    [7.077273, 125.625049], [7.085050, 125.624367], [7.090193, 125.618809], [7.094792, 125.615478],
                    [7.097080, 125.614976], [7.107312, 125.613579], [7.109804, 125.616437], [7.112934, 125.620891],
                    [7.111065, 125.618257], [7.086568, 125.624045]
                ],
                stops: ["Buhangin", "Dacudao", "Bajada", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "BUHANGIN VIA JP LAUREL",
                waypoints: [
                    [7.114073, 125.622505], [7.109884, 125.616609], [7.108686, 125.613326], [7.101340, 125.614604],
                    [7.095239, 125.615183], [7.092530, 125.611052], [7.090879, 125.609962], [7.087260, 125.610327],
                    [7.083544, 125.612404], [7.076841, 125.613279], [7.075228, 125.610177], [7.073344, 125.608863],
                    [7.069724, 125.602517], [7.064736, 125.606627], [7.063096, 125.609369], [7.069255, 125.611289],
                    [7.076629, 125.613378], [7.087307, 125.610308], [7.092184, 125.610602], [7.095564, 125.615801],
                    [7.099120, 125.614813], [7.105987, 125.613788], [7.110474, 125.617458], [7.113247, 125.621361]
                ],
                stops: ["Buhangin", "Abreeza Mall", "Bajada", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "BUNAWAN VIA BUHANGIN",
                waypoints: [
                    [7.236132, 125.642402], [7.233242, 125.641464], [7.227718, 125.639887], [7.215691, 125.644072],
                    [7.191848, 125.648286], [7.176519, 125.653712], [7.165768, 125.657035], [7.155485, 125.657400],
                    [7.149758, 125.659955], [7.103959, 125.643962], [7.097667, 125.620535], [7.092418, 125.610912],
                    [7.087377, 125.610294], [7.076703, 125.613345], [7.069032, 125.619658], [7.073754, 125.624492],
                    [7.085785, 125.624244], [7.097113, 125.620414], [7.103043, 125.639155], [7.116367, 125.654129],
                    [7.126841, 125.661808], [7.141348, 125.661397], [7.148533, 125.659558]
                ],
                stops: ["Bunawan", "Buhangin", "Bajada", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "MAA-BANKEROHAN",
                waypoints: [
                    [7.102671, 125.581855], [7.098540, 125.581168], [7.091928, 125.579719], [7.084422, 125.581243],
                    [7.079972, 125.583024], [7.075755, 125.585064], [7.071507, 125.587612], [7.067483, 125.591447],
                    [7.061690, 125.592942], [7.063703, 125.600899], [7.064991, 125.601758], [7.067573, 125.602284],
                    [7.069703, 125.602509], [7.067477, 125.602147], [7.064629, 125.601492], [7.063639, 125.600521],
                    [7.100627, 125.581608], [7.089597, 125.580127], [7.080611, 125.582810], [7.071954, 125.587318],
                    [7.061882, 125.592904]
                ],
                stops: ["Maa", "San Pedro St", "Bolton Bridge", "Bankerohan"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "MATINA",
                waypoints: [
                    [7.058651, 125.568827], [7.055557, 125.576066], [7.056159, 125.577494], [7.058832, 125.580986],
                    [7.059401, 125.582312], [7.063495, 125.600368], [7.064512, 125.601586], [7.067578, 125.602282],
                    [7.064198, 125.607412], [7.063149, 125.609572], [7.069149, 125.611256], [7.073764, 125.615569],
                    [7.074222, 125.623017], [7.082293, 125.624544], [7.080823, 125.622692], [7.077092, 125.622832],
                    [7.073844, 125.615746], [7.073578, 125.611469], [7.068931, 125.603444], [7.063926, 125.601051],
                    [7.059683, 125.583875], [7.057256, 125.578793], [7.055728, 125.576662], [7.092018, 125.570549]
                ],
                stops: ["Matina", "SM Ecoland", "San Pedro St", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "MATINA APLAYA",
                waypoints: [
                    [7.058677, 125.568786], [7.055611, 125.575932], [7.056494, 125.577858], [7.059295, 125.581814],
                    [7.063532, 125.600525], [7.067344, 125.602210], [7.064512, 125.606912], [7.063170, 125.609488],
                    [7.073626, 125.612497], [7.074041, 125.619730], [7.074840, 125.625202], [7.082314, 125.624601],
                    [7.080845, 125.722740], [7.077289, 125.624963], [7.074190, 125.621908], [7.073631, 125.612322],
                    [7.068244, 125.609507], [7.066711, 125.609088], [7.068925, 125.603496], [7.063958, 125.601063],
                    [7.059566, 125.582861], [7.057320, 125.578851], [7.055696, 125.576624], [7.058746, 125.568838]
                ],
                stops: ["Matina Aplaya", "SM Ecoland", "San Pedro St", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "MATINA CROSSING",
                waypoints: [
                    [7.058651, 125.568823], [7.055579, 125.576006], [7.057176, 125.578753], [7.059268, 125.581774],
                    [7.063506, 125.600444], [7.064853, 125.601687], [7.067978, 125.602508], [7.063096, 125.609377],
                    [7.069117, 125.619742], [7.071513, 125.621674], [7.074361, 125.624980], [7.074222, 125.623037],
                    [7.073477, 125.611212], [7.068164, 125.609474], [7.064794, 125.608851], [7.068952, 125.603484],
                    [7.063655, 125.600597], [7.059646, 125.583718], [7.057330, 125.578892], [7.055754, 125.576745],
                    [7.058720, 125.568895], [7.064464, 125.601574], [7.070139, 125.620338], [7.073759, 125.624524]
                ],
                stops: ["Matina Crossing", "SM Ecoland", "San Pedro St", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "MINTAL",
                waypoints: [
                    [7.093163, 125.499072], [7.074787, 125.517977], [7.059060, 125.538458], [7.060615, 125.542259],
                    [7.063500, 125.545350], [7.060061, 125.551638], [7.061685, 125.561607], [7.055627, 125.575879],
                    [7.051655, 125.589697], [7.054211, 125.599037], [7.057719, 125.603454], [7.060407, 125.609118],
                    [7.063692, 125.612568], [7.073520, 125.611260], [7.075244, 125.610144], [7.068207, 125.602664],
                    [7.064214, 125.601290], [7.059604, 125.583613], [7.057048, 125.578579], [7.055653, 125.576292],
                    [7.060982, 125.542683], [7.063756, 125.547416], [7.050952, 125.588237], [7.056500, 125.600282]
                ],
                stops: ["Mintal", "SM Ecoland", "San Pedro St", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "PANACAN VIA CABAGUIO",
                waypoints: [
                    [7.150080, 125.659812], [7.147238, 125.661015], [7.126841, 125.661808], [7.117331, 125.654890],
                    [7.103959, 125.643962], [7.097667, 125.620535], [7.094462, 125.614180], [7.092418, 125.610912],
                    [7.087377, 125.610294], [7.083299, 125.612441], [7.076703, 125.613345], [7.069277, 125.619867],
                    [7.073754, 125.624492], [7.085785, 125.624244], [7.097679, 125.620527], [7.103070, 125.639380],
                    [7.116538, 125.654226], [7.125443, 125.661420], [7.135450, 125.661560], [7.145590, 125.661253],
                    [7.149133, 125.660274], [7.103778, 125.643404]
                ],
                stops: ["Panacan", "Cabaguio", "Agdao", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "Route 8",
                waypoints: [
                    [7.065241, 125.608231], [7.067195, 125.605715], [7.068233, 125.604384], [7.071023, 125.607749],
                    [7.071789, 125.607153], [7.073227, 125.608896], [7.073589, 125.609099], [7.074909, 125.609835],
                    [7.078545, 125.606884], [7.079418, 125.608000], [7.075782, 125.610972], [7.074606, 125.611256],
                    [7.066689, 125.609078], [7.066029, 125.608805], [7.065667, 125.608638], [7.065193, 125.608338],
                    [7.065252, 125.608225]
                ],
                stops: ["Sasa", "Buhangin", "Bajada", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "Route 9",
                waypoints: [
                    [7.076602, 125.613632], [7.077374, 125.617398], [7.080014, 125.620513], [7.083256, 125.624432],
                    [7.077278, 125.624965], [7.074355, 125.624855], [7.071113, 125.621014], [7.069245, 125.619731],
                    [7.066791, 125.616817], [7.064134, 125.613573], [7.063000, 125.611228], [7.063729, 125.608304],
                    [7.067568, 125.603531], [7.066860, 125.602798], [7.067946, 125.600845], [7.069729, 125.602503],
                    [7.073541, 125.600536], [7.079418, 125.608006], [7.075990, 125.612180], [7.076597, 125.613650],
                    [7.070357, 125.620348], [7.064682, 125.606672], [7.067334, 125.601596], [7.075596, 125.603284]
                ],
                stops: ["Tibungco", "Buhangin", "Bajada", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "PANAKAN-SM",
                waypoints: [
                    [7.049739, 125.586068], [7.051751, 125.590029], [7.054125, 125.598929], [7.056920, 125.600577],
                    [7.059683, 125.601518], [7.063612, 125.600724], [7.066982, 125.602131], [7.068233, 125.602823],
                    [7.073221, 125.608883], [7.075388, 125.611502], [7.076639, 125.613417], [7.083682, 125.612360],
                    [7.090709, 125.609945], [7.093067, 125.611954], [7.096858, 125.618011], [7.102937, 125.638699],
                    [7.104358, 125.644311], [7.116367, 125.654129], [7.125070, 125.661184], [7.135450, 125.661560],
                    [7.147932, 125.660780], [7.087057, 125.610417], [7.099301, 125.626213], [7.151397, 125.659204]
                ],
                stops: ["Panacan", "Buhangin", "SM Ecoland", "SM City Davao"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            },
            {
                name: "TORIL",
                waypoints: [
                    [7.012294, 125.489498], [7.020760, 125.497167], [7.036093, 125.519727], [7.045053, 125.532891],
                    [7.051389, 125.542088], [7.061696, 125.561611], [7.059385, 125.567278], [7.055611, 125.575955],
                    [7.059002, 125.581224], [7.063437, 125.600148], [7.067988, 125.602531], [7.071007, 125.607757],
                    [7.073434, 125.611240], [7.066796, 125.616396], [7.063687, 125.612387], [7.060876, 125.609419],
                    [7.058981, 125.607659], [7.057538, 125.601927], [7.053753, 125.598390], [7.050031, 125.583193],
                    [7.055845, 125.577698], [7.017437, 125.492847], [7.040959, 125.526896], [7.059513, 125.583629]
                ],
                stops: ["Toril", "SM Ecoland", "San Pedro St", "Claveria"],
                image: "https://images.unsplash.com/photo-1611832191399-2c8dbed3e6d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80"
            }
        ];

        // Map stops to coordinates for destination lookup
        const stopToCoord = {};
        jeepneyRoutes.forEach(route => {
            route.stops.forEach((stop, index) => {
                if (index < route.waypoints.length) {
                    stopToCoord[stop.toLowerCase()] = route.waypoints[index];
                }
            });
        });

        // Populate route dropdown
        function populateRouteDropdown() {
            const select = document.getElementById('route-select');
            jeepneyRoutes.forEach(route => {
                const option = document.createElement('option');
                option.value = route.name;
                option.textContent = route.name;
                select.appendChild(option);
            });
        }

        function toggleLocation() {
            const button = document.getElementById('location-button');
            try {
                if (watchId) {
                    navigator.geolocation.clearWatch(watchId);
                    watchId = null;
                    if (userMarker) {
                        map.removeLayer(userMarker);
                        userMarker = null;
                    }
                    if (walkingLayer) {
                        map.removeLayer(walkingLayer);
                        walkingLayer = null;
                    }
                    button.classList.remove('active');
                } else {
                    if (navigator.geolocation) {
                        watchId = navigator.geolocation.watchPosition(
                            position => {
                                const { latitude, longitude } = position.coords;
                                userLocation = [latitude, longitude];
                                if (userMarker) {
                                    userMarker.setLatLng(userLocation);
                                } else {
                                    userMarker = L.marker(userLocation, {
                                        icon: L.divIcon({
                                            className: 'user-location',
                                            html: '<div style="background-color: #0745f1; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
                                            iconSize: [16, 16]
                                        })
                                    }).addTo(map);
                                }
                                map.panTo(userLocation);
                            },
                            error => {
                                document.getElementById('results').innerHTML = '<p class="text-red-500">Location access denied.</p>';
                                console.error('Geolocation error:', error);
                            },
                            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                        );
                        button.classList.add('active');
                    } else {
                        document.getElementById('results').innerHTML = '<p class="text-red-500">Geolocation not supported.</p>';
                    }
                }
            } catch (error) {
                console.error('Error in toggleLocation:', error);
            }
        }

        function toggleSidebar() {
    try {
        const sidebar = document.getElementById('sidebar');
        const toggleButton = document.getElementById('toggle-sidebar');
        const mapElement = document.getElementById('map');

        const isHidden = sidebar.classList.contains('hidden');
        if (isHidden) {
            sidebar.classList.remove('hidden');
            toggleButton.classList.remove('hidden');
            toggleButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="#333" stroke-width="2"/></svg>';
            mapElement.style.marginLeft = ''; // Reset margin if needed
        } else {
            sidebar.classList.add('hidden');
            toggleButton.classList.add('hidden');
            toggleButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="#333" stroke-width="2"/></svg>';
            mapElement.style.marginLeft = '0';
        }

        setTimeout(() => {
            map.invalidateSize(); // Let Leaflet resize map properly
        }, 300); // Delay to match sidebar animation
    } catch (error) {
        console.error('Error in toggleSidebar:', error);
    }
}

        function toggleDetails(element) {
            try {
                const details = element.parentElement.nextElementSibling;
                const arrow = element;
                if (details.classList.contains('expanded')) {
                    details.classList.remove('expanded');
                    arrow.classList.remove('expanded');
                } else {
                    details.classList.add('expanded');
                    arrow.classList.add('expanded');
                }
            } catch (error) {
                console.error('Error in toggleDetails:', error);
            }
        }

        function haversineDistance(coord1, coord2) {
            try {
                const [lat1, lon1] = coord1;
                const [lat2, lon2] = coord2;
                const R = 6371; // Earth's radius in km
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                          Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c; // Distance in km
            } catch (error) {
                console.error('Error in haversineDistance:', error);
                return Infinity;
            }
        }

        function calculateRouteDistance(waypoints) {
            try {
                let total = 0;
                for (let i = 0; i < waypoints.length - 1; i++) {
                    total += haversineDistance(waypoints[i], waypoints[i + 1]);
                }
                return total;
            } catch (error) {
                console.error('Error in calculateRouteDistance:', error);
                return 0;
            }
        }

        function calculateFare(distance, isTwoRoute) {
            try {
                const baseFare = 12; // ₱12 for first 4 km
                const extraFare = 2; // ₱2 per additional km
                let fare = baseFare;
                if (distance > 4) {
                    fare += Math.ceil(distance - 4) * extraFare;
                }
                return isTwoRoute ? fare * 2 : fare; // Double for two-jeepney routes
            } catch (error) {
                console.error('Error in calculateFare:', error);
                return 0;
            }
        }

        function findNearestWaypoint(routes, fromCoord = userLocation) {
            try {
                if (!fromCoord) return null;
                let nearest = null;
                let minDistance = Infinity;
                routes.forEach(route => {
                    route.waypoints.forEach((waypoint, index) => {
                        const distance = haversineDistance(fromCoord, waypoint);
                        if (distance < minDistance) {
                            minDistance = distance;
                            nearest = { waypoint, route, index };
                        }
                    });
                });
                return { waypoint: nearest.waypoint, distance: minDistance, route: nearest.route, stopIndex: nearest.index };
            } catch (error) {
                console.error('Error in findNearestWaypoint:', error);
                return null;
            }
        }

        function drawWalkingPath(toWaypoint) {
            try {
                if (walkingLayer) {
                    map.removeLayer(walkingLayer);
                    walkingLayer = null;
                }
                if (userLocation && toWaypoint) {
                    walkingLayer = L.Routing.control({
                        waypoints: [
                            L.latLng(userLocation),
                            L.latLng(toWaypoint)
                        ],
                        lineOptions: {
                            styles: [{ color: '#555', weight: 4, opacity: 0.7, dashArray: '5, 10' }]
                        },
                        createMarker: () => null,
                        router: L.Routing.osrmv1({ 
                            serviceUrl: 'https://router.project-osrm.org/route/v1',
                            profile: 'foot'
                        }),
                        addWaypoints: false,
                        draggableWaypoints: false,
                        fitSelectedRoutes: false
                    }).on('routingerror', function(e) {
                        console.error('Routing error in drawWalkingPath:', e);
                    }).addTo(map);
                }
            } catch (error) {
                console.error('Error in drawWalkingPath:', error);
            }
        }

        function clearRoutes() {
            try {
                routeLayers.forEach(layer => {
                    if (map.hasLayer(layer)) {
                        map.removeLayer(layer);
                    }
                });
                routeLayers = [];
                document.querySelectorAll('.result-card').forEach(card => card.classList.remove('active'));
                const distanceEl = document.getElementById('route-distance');
                distanceEl.classList.add('hidden');
                distanceEl.textContent = '';
                const routeInfo = document.getElementById('route-info');
                routeInfo.classList.remove('active');
                document.getElementById('route-info-title').textContent = '';
                document.getElementById('route-info-details').textContent = '';
            } catch (error) {
                console.error('Error in clearRoutes:', error);
            }
        }

        function getBounds(routes) {
            try {
                const bounds = L.latLngBounds();
                routes.forEach(route => {
                    route.waypoints.forEach(coord => bounds.extend(coord));
                });
                return bounds;
            } catch (error) {
                console.error('Error in getBounds:', error);
                return map.getBounds();
            }
        }

        function saveRoute(index) {
            try {
                const routeData = routeDataStore[index];
                const routeToSave = {
                    isTwoRoute: routeData.isTwoRoute,
                    route: routeData.route,
                    route1: routeData.route1,
                    route2: routeData.route2,
                    commonStop: routeData.commonStop,
                    destination: routeData.destination,
                    fare: routeData.fare,
                    totalDistance: routeData.totalDistance,
                    timestamp: routeData.timestamp
                };
                savedRoutes.push(routeToSave);
                localStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));
                if (currentFilter === 'saved') {
                    showSavedRoutes();
                }
            } catch (error) {
                console.error('Error in saveRoute:', error);
            }
        }

        function deleteRoute(index) {
            try {
                savedRoutes.splice(index, 1);
                localStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));
                showSavedRoutes();
            } catch (error) {
                console.error('Error in deleteRoute:', error);
            }
        }

        function shareRoute(index) {
            try {
                const routeData = routeDataStore[index];
                const text = routeData.isTwoRoute
                    ? `Jeepney Route: ${routeData.route1.name} → ${routeData.route2.name}, Transfer at ${routeData.commonStop}, Fare: ₱${routeData.fare}, Distance: ${routeData.totalDistance.toFixed(1)} km`
                    : `Jeepney Route: ${routeData.route.name} to ${routeData.destination}, Fare: ₱${routeData.fare}, Distance: ${routeData.totalDistance.toFixed(1)} km`;
                if (navigator.share) {
                    navigator.share({
                        title: 'Jeepney Route',
                        text: text
                    }).catch(error => console.error('Error sharing:', error));
                } else {
                    navigator.clipboard.writeText(text).then(() => {
                        alert('Route details copied to clipboard!');
                    });
                }
            } catch (error) {
                console.error('Error in shareRoute:', error);
            }
        }

        function showResults(filter) {
            try {
                currentFilter = filter;
                const tabs = document.querySelectorAll('.filter-tab');
                tabs.forEach(tab => {
                    tab.classList.toggle('active', tab.dataset.tab === filter);
                });
                const resultsDiv = document.getElementById('results');
                const savedRoutesView = document.getElementById('saved-routes-view');
                const backButton = document.getElementById('back-button');
                if (filter === 'saved') {
                    resultsDiv.classList.add('hidden');
                    savedRoutesView.classList.add('active');
                    backButton.classList.add('active');
                    showSavedRoutes();
                } else if (filter === 'history') {
                    resultsDiv.classList.remove('hidden');
                    savedRoutesView.classList.remove('active');
                    backButton.classList.remove('active');
                    displayHistory();
                } else {
    resultsDiv.classList.remove('hidden');
    savedRoutesView.classList.remove('active');
    backButton.classList.remove('active');
    resultsDiv.innerHTML = routeDataStore.length
        ? ''  // Clear, will re-render below
        : '<p class="text-gray-600">Search for a route to see results.</p>';

    // Re-render selected route if exists
    if (routeDataStore.length > 0) {
        const routeData = routeDataStore[0];
        const isTwoRoute = routeData.isTwoRoute;
        const name = isTwoRoute
            ? `${routeData.route1.name} → ${routeData.route2.name}`
            : routeData.route.name;

        const details = isTwoRoute
            ? `Transfer at ${routeData.commonStop}, Fare: ₱${routeData.fare}, Distance: ${routeData.totalDistance.toFixed(1)} km`
            : `To ${routeData.destination}, Fare: ₱${routeData.fare}, Distance: ${routeData.totalDistance.toFixed(1)} km`;

        const image = routeData.route?.image || routeData.route1?.image || '';

        resultsDiv.innerHTML = `
            <div class="result-card active" data-index="0">
                <div class="route-header">
                    <span class="route-name">${name}</span>
                    <svg class="toggle-arrow expanded" onclick="toggleDetails(this)" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 10L12 15L17 10" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="route-details expanded">
                    <p class="text-sm text-gray-600">${new Date(routeData.timestamp).toLocaleString()}</p>
                    <p class="text-sm text-gray-600">${details}</p>
                    <img src="${image}" alt="Jeepney" class="jeepney-img">
                    <div class="mt-2">
                        <button class="action-button" onclick="highlightRoute(0)">Select</button>
                        <button class="action-button" onclick="saveRoute(0)">Save</button>
                        <button class="action-button" onclick="shareRoute(0)">Share</button>
                    </div>
                </div>
            </div>`;
    }
}

            } catch (error) {
                console.error('Error in showResults:', error);
            }
        }

        function showSavedRoutes() {
            try {
                const savedRoutesDiv = document.getElementById('saved-routes');
                savedRoutesDiv.innerHTML = savedRoutes.length ? '' : '<p class="text-gray-600">No saved routes.</p>';
                savedRoutes.forEach((routeData, index) => {
                    const isTwoRoute = routeData.isTwoRoute;
                    const routeName = isTwoRoute ? `${routeData.route1.name} → ${routeData.route2.name}` : routeData.route.name;
                    const details = isTwoRoute
                        ? `Transfer at ${routeData.commonStop}, Fare: ₱${routeData.fare}, Distance: ${routeData.totalDistance.toFixed(1)} km`
                        : `To ${routeData.destination}, Fare: ₱${routeData.fare}, Distance: ${routeData.totalDistance.toFixed(1)} km`;
                    savedRoutesDiv.innerHTML += `
                        <div class="saved-route-card" data-index="${index}">
                            <div class="route-header">
                                <span class="route-name">${routeName}</span>
                                <svg class="toggle-arrow" onclick="toggleDetails(this)" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 10L12 15L17 10" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <div class="route-details">
                                <p class="text-sm text-gray-600">${new Date(routeData.timestamp).toLocaleString()}</p>
                                <p class="text-sm text-gray-600">${details}</p>
                                <div class="mt-2">
                                    <button class="action-button" onclick="highlightSavedRoute(${index})">Select</button>
                                    <button class="action-button delete-button" onclick="deleteRoute(${index})">Delete</button>
                                </div>
                            </div>
                        </div>`;
                });
            } catch (error) {
                console.error('Error in showSavedRoutes:', error);
            }
        }

        function highlightSavedRoute(index) {
            try {
                routeDataStore = [savedRoutes[index]];
                routeDataStore[0].nearestWaypoint = findNearestWaypoint([routeDataStore[0].route || routeDataStore[0].route1])?.waypoint;
                highlightRoute(0);
                showResults('routes');
            } catch (error) {
                console.error('Error in highlightSavedRoute:', error);
            }
        }

        function displayHistory() {
            try {
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = history.length ? '' : '<p class="text-gray-600">No search history.</p>';
                history.forEach((routeData, index) => {
                    const isTwoRoute = routeData.isTwoRoute;
                    const routeName = isTwoRoute ? `${routeData.route1.name} → ${routeData.route2.name}` : routeData.route.name;
                    const details = isTwoRoute
                        ? `Transfer at ${routeData.commonStop}, Fare: ₱${routeData.fare}, Distance: ${routeData.totalDistance.toFixed(1)} km`
                        : `To ${routeData.destination}, Fare: ₱${routeData.fare}, Distance: ${routeData.totalDistance.toFixed(1)} km`;
                    resultsDiv.innerHTML += `
                        <div class="result-card" data-index="${index}">
                            <div class="route-header">
                                <span class="route-name">${routeName}</span>
                                <svg class="toggle-arrow" onclick="toggleDetails(this)" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 10L12 15L17 10" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <div class="route-details">
                                <p class="text-sm text-gray-600">${new Date(routeData.timestamp).toLocaleString()}</p>
                                <p class="text-sm text-gray-600">${details}</p>
                                <div class="mt-2">
                                    <button class="action-button" onclick="highlightHistoryRoute(${index})">Select</button>
                                    <button class="action-button" onclick="saveRoute(${index})">Save</button>
                                </div>
                            </div>
                        </div>`;
                });
            } catch (error) {
                console.error('Error in displayHistory:', error);
            }
        }

        function highlightHistoryRoute(index) {
    try {
        const routeData = history[index];

        // Prevent duplicate entries in routeDataStore
        routeDataStore = [routeData];

        // Update nearestWaypoint if needed
        routeDataStore[0].nearestWaypoint = findNearestWaypoint([
            routeData.route || routeData.route1
        ])?.waypoint;

        // Build route display
        const isTwoRoute = routeData.isTwoRoute;
        const name = isTwoRoute
            ? `${routeData.route1.name} → ${routeData.route2.name}`
            : routeData.route.name;

        const details = isTwoRoute
            ? `Transfer at ${routeData.commonStop}, Fare: ₱${routeData.fare}, Distance: ${routeData.totalDistance.toFixed(1)} km`
            : `To ${routeData.destination}, Fare: ₱${routeData.fare}, Distance: ${routeData.totalDistance.toFixed(1)} km`;

        const image = routeData.route?.image || routeData.route1?.image || '';

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div class="result-card active" data-index="0">
                <div class="route-header">
                    <span class="route-name">${name}</span>
                    <svg class="toggle-arrow expanded" onclick="toggleDetails(this)" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 10L12 15L17 10" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="route-details expanded">
                    <p class="text-sm text-gray-600">${new Date(routeData.timestamp).toLocaleString()}</p>
                    <p class="text-sm text-gray-600">${details}</p>
                    <img src="${image}" alt="Jeepney" class="jeepney-img">
                    <div class="mt-2">
                        <button class="action-button" onclick="highlightRoute(0)">Select</button>
                        <button class="action-button" onclick="saveRoute(0)">Save</button>
                    </div>
                </div>
            </div>
        `;

        // Highlight on map and switch tab
        highlightRoute(0);
        showResults('routes');
    } catch (error) {
        console.error('Error in highlightHistoryRoute:', error);
    }
}



        function displaySelectedRoute() {
            try {
                const select = document.getElementById('route-select');
                const routeName = select.value;
                clearRoutes();
                if (!routeName) return;

                const route = jeepneyRoutes.find(r => r.name === routeName);
                if (!route) return;

                const totalDistance = calculateRouteDistance(route.waypoints);
                const fare = calculateFare(totalDistance, false);

                routeDataStore = [{ route, isTwoRoute: false, destination: route.stops[route.stops.length - 1], fare, totalDistance, timestamp: new Date().toISOString(), nearestWaypoint: null }];

                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = `
                    <div class="result-card active" data-index="0">
                        <div class="route-header">
                            <span class="route-name">${route.name}</span>
                            <svg class="toggle-arrow expanded" onclick="toggleDetails(this)" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 10L12 15L17 10" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="route-details expanded">
                            <p class="text-sm text-gray-600">${new Date().toLocaleString()}</p>
                            <p class="text-sm text-gray-600">To ${route.stops[route.stops.length - 1]}, Fare: ₱${fare}, Distance: ${totalDistance.toFixed(1)} km</p>
                            <img src="${route.image}" alt="Jeepney" class="jeepney-img">
                            <div class="mt-2">
                                <button class="action-button" onclick="highlightRoute(0)">Select</button>
                                <button class="action-button" onclick="saveRoute(0)">Save</button>
                                <button class="action-button" onclick="shareRoute(0)">Share</button>
                            </div>
                        </div>
                    </div>`;

                highlightRoute(0);
            } catch (error) {
                console.error('Error in displaySelectedRoute:', error);
            }
        }

        function highlightRoute(index) {
            try {
                if (index < 0 || index >= routeDataStore.length) {
                    console.error('Invalid route index:', index);
                    return;
                }

                const routeData = routeDataStore[index];
                clearRoutes();

                const card = document.querySelector(`.result-card[data-index="${index}"]`);
                if (card) {
                    card.classList.add('active');
                }
                activeRouteIndex = index;

                const distanceEl = document.getElementById('route-distance');
                distanceEl.textContent = `Distance: ${routeData.totalDistance.toFixed(1)} km`;
                distanceEl.classList.remove('hidden');

                const routeInfo = document.getElementById('route-info');
                routeInfo.classList.add('active');
                const routeInfoTitle = document.getElementById('route-info-title');
                const routeInfoDetails = document.getElementById('route-info-details');

                const validateWaypoints = waypoints => waypoints.every(coord => 
                    Array.isArray(coord) && coord.length === 2 && 
                    typeof coord[0] === 'number' && typeof coord[1] === 'number'
                );

                if (routeData.isTwoRoute) {
                    const { route1, route2, commonStop } = routeData;
                    routeInfoTitle.textContent = `${route1.name} → ${route2.name}`;
                    routeInfoDetails.textContent = `Transfer at ${commonStop}, Fare: ₱${routeData.fare}, Distance: ${routeData.totalDistance.toFixed(1)} km`;

                    if (!validateWaypoints(route1.waypoints) || !validateWaypoints(route2.waypoints)) {
                        console.error('Invalid waypoints for two-jeepney route');
                        L.polyline([...route1.waypoints, ...route2.waypoints], { color: '#0745f1', weight: 4, opacity: 0.7 }).addTo(map);
                        return;
                    }

                    const waypoints1 = route1.waypoints.map(coord => L.latLng(coord));
                    const routingControl1 = L.Routing.control({
                        waypoints: waypoints1,
                        line ,
                        
                        options: {
                            styles: [{ color: '#ff5c5c', weight: 4, opacity: 0.7 }]
                        },
                        createMarker: () => null,
                        addWaypoints: false,
                        draggableWaypoints: false,
                        fitSelectedRoutes: false
                    }).on('routingerror', function(e) {
                        console.error('Routing error for route1:', e);
                    }).addTo(map);
                    routeLayers.push(routingControl1);

                    const waypoints2 = route2.waypoints.map(coord => L.latLng(coord));
                    const routingControl2 = L.Routing.control({
                        waypoints: waypoints2,
                        lineOptions: {
                            styles: [{ color: '#ff5c5c', weight: 4, opacity: 0.7 }]
                        },
                        createMarker: () => null,
                        addWaypoints: false,
                        draggableWaypoints: false,
                        fitSelectedRoutes: false
                    }).on('routingerror', function(e) {
                        console.error('Routing error for route2:', e);
                    }).addTo(map);
                    routeLayers.push(routingControl2);

                    const bounds = getBounds([route1, route2]);
                    map.fitBounds(bounds);
                } else {
                    const { route } = routeData;
                    routeInfoTitle.textContent = route.name;
                    routeInfoDetails.textContent = `To ${routeData.destination}, Fare: ₱${routeData.fare}, Distance: ${routeData.totalDistance.toFixed(1)} km`;

                    if (!validateWaypoints(route.waypoints)) {
                        console.error('Invalid waypoints for single route');
                        L.polyline(route.waypoints, { color: '#ff5c5c', weight: 4, opacity: 0.7 }).addTo(map);
                        return;
                    }

                    const waypoints = route.waypoints.map(coord => L.latLng(coord));
                    const routingControl = L.Routing.control({
                        waypoints: waypoints,
                        lineOptions: {
                            styles: [{ color: '#0745f1', weight: 4, opacity: 0.7 }]
                        },
                        createMarker: () => null,
                        addWaypoints: false,
                        draggableWaypoints: false,
                        fitSelectedRoutes: false
                    }).on('routingerror', function(e) {
                        console.error('Routing error for single route:', e);
                    }).addTo(map);
                    routeLayers.push(routingControl);

                    const bounds = getBounds([route]);
                    map.fitBounds(bounds);
                }

                if (userLocation && routeData.nearestWaypoint) {
                    drawWalkingPath(routeData.nearestWaypoint);
                }
            } catch (error) {
                console.error('Error in highlightRoute:', error);
            }
        }

        function searchRoutes() {
    const input = document.getElementById('search-input').value.trim().toLowerCase();
    if (!input) return;

    clearRoutes();

    const matchedRoutes = jeepneyRoutes.filter(route =>
        route.stops.some(stop => stop.toLowerCase().includes(input))
    );

    if (matchedRoutes.length === 0) {
        document.getElementById('results').innerHTML = '<p class="text-gray-600">No matching routes found.</p>';
        return;
    }

    routeDataStore = matchedRoutes.map(route => {
        const totalDistance = calculateRouteDistance(route.waypoints);
        const fare = calculateFare(totalDistance, false);
        return {
            route,
            isTwoRoute: false,
            destination: input,
            fare,
            totalDistance,
            timestamp: new Date().toISOString(),
            nearestWaypoint: findNearestWaypoint([route])?.waypoint
        };
    });

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    routeDataStore.forEach((routeData, index) => {
        resultsDiv.innerHTML += `
            <div class="result-card" data-index="${index}">
                <div class="route-header">
                    <span class="route-name">${routeData.route.name}</span>
                    <svg class="toggle-arrow" onclick="toggleDetails(this)" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 10L12 15L17 10" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="route-details">
                    <p class="text-sm text-gray-600">${new Date(routeData.timestamp).toLocaleString()}</p>
                    <p class="text-sm text-gray-600">To ${input}, Fare: ₱${routeData.fare}, Distance: ${routeData.totalDistance.toFixed(1)} km</p>
                    <img src="${routeData.route.image}" alt="Jeepney" class="jeepney-img">
                    <div class="mt-2">
                        <button class="action-button" onclick="highlightRoute(${index})">Select</button>
                        <button class="action-button" onclick="saveRoute(${index})">Save</button>
                    </div>
                </div>
            </div>`;
    });

    showResults('routes');
    history.push(...routeDataStore);
    localStorage.setItem('history', JSON.stringify(history));
}

        // Initialize
        try {
            populateRouteDropdown();
            document.querySelectorAll('.filter-tab').forEach(tab => {
                tab.addEventListener('click', () => showResults(tab.dataset.tab));
            });
            document.getElementById('search-input').addEventListener('keypress', e => {
                if (e.key === 'Enter') searchRoutes();
            });
            map.fitBounds(getBounds(jeepneyRoutes));
        } catch (error) {
            console.error('Initialization error:', error);
        }