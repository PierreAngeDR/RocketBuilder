
/**
 * Language Settings
 */

let languages = {};
languages['lg-choose-language'] = {french: "Langage" , english: "Language"};
languages['lg-document-title'] = {french: "Simulation Modèle Masse Variable et Traînée" , english: "Rocket Model Simulation with Variable Mass & Drag"};
languages['lg-time'] = {french: "Temps" , english: "Time"};
languages['lg-speed'] = {french: "Vitesse" , english: "Speed"};
languages['lg-gravity'] = {french: "Gravité" , english: "Gravity"};
languages['lg-height'] = {french: "Altitude" , english: "Height"};
languages['lg-total-mass'] = {french: "Masse Totale" , english: "Total Mass"};
languages['lg-rocket-mass'] = {french: "Masse à Vide de la fusée (kg)" , english: "Empty Rocket Mass (kg)"};
languages['lg-fuel-mass'] = {french: "Masse de Carburant (kg)" , english: "Fuel Mass (kg)"};
languages['lg-fuel-consumption'] = {french: "Consommation de carburant (kg/s)" , english: "Fuel Consumption (kg/s)"};
languages['lg-rocket-front-section'] = {french: "Section frontale de la fusée (m²)" , english: "Rocket Front surface (m²)"};
languages['lg-rocket-thrust'] = {french: "Poussée Moteur (N)" , english: "Engine Thrust (N)"};
languages['lg-time-step'] = {french: "Pas d'échantillonnage (s)" , english: "Time Step (s)"};
languages['lg-time-step-simple'] = {french: "Pas (s)" , english: "Step (s)"};
languages['lg-lowest-printable-speed'] = {french: "Vitesse minimale affichée (m/s)" , english: "Minimal printed Speed (m/s)"};
languages['lg-lowest-printable-acceleration'] = {french: "Accélération minimale affichée (m/s²)" , english: "Minimal printed Acceleration (m/s²)"};
languages['lg-maximum-printable-time'] = {french: "Durée maximale affichée (s)" , english: "Maximum printed Duration (s)"};
languages['lg-scale'] = {french: "Échelle" , english: "Scale"};
languages['lg-zoom-in'] = {french: "Zoomer" , english: "Zoom In"};
languages['lg-zoom-out'] = {french: "DéZoomer" , english: "Zoom Out"};
languages['lg-run-methods'] = {french: "Lancer les 3 méthodes" , english: "Run the 3 methods"};
languages['lg-choose-rocket'] = {french: "Choix du modèle de fusée" , english: "Choose a rocket model"};
languages['lg-graphs'] = {french: "Graphiques" , english: "Graphs"};
languages['lg-chart-height'] = {french: "Tableaux d'altitude" , english: "Height Grid"};
languages['lg-chart-speed'] = {french: "Tableaux de vitesse" , english: "Speed Grid"};
languages['lg-print-grid'] = {french: "Imprimer la grille" , english: "Print Grid"};
languages['lg-download-pdf'] = {french: "Télécharger la grille au format pdf" , english: "Download Pdf file"};
languages['lg-download-xlsx'] = {french: "Télécharger la grille au format excel" , english: "Download Excel file"};
languages['lg-download-csv'] = {french: "Télécharger la grille au format csv" , english: "Download Csv file"};
languages['lg-download-json'] = {french: "Télécharger la grille au format json" , english: "Download Json file"};
languages['lg-index'] = {french: "Index" , english: "Index"};
languages['lg-time'] = {french: "Temps (s)" , english: "Time (s)"};
languages['lg-acceleration'] = {french: "Acceleration (m/s²)" , english: "Acceleration (m/s²)"};
languages['lg-drag'] = {french: "Traînée (N)" , english: "Drag (N)"};
languages['lg-mass'] = {french: "Masse (kg)" , english: "Mass (kg)"};
languages['lg-euler'] = {french: "Euler" , english: "Euler"};
languages['lg-heun'] = {french: "Heun" , english: "Heun"};
languages['lg-rk4'] = {french: "Runge-Kutta 4" , english: "Runge-Kutta 4"};
languages['lg-errorEulerRK4'] = {french: "Erreur Euler/RK4" , english: "Error Euler/RK4"};
languages['lg-errorHeunRK4'] = {french: "Erreur Heun/RK4" , english: "Error Heun/RK4"};
languages['lg-chart-title-altitude'] = {french: "Altitude / Temps" , english: "Height / Time"};
languages['lg-chart-title-thrust'] = {french: "Propulsion / Temps" , english: "Thrust / Time"};
languages['lg-chart-title-gravity'] = {french: "Gravité / Temps" , english: "Gravity / Time"};
languages['lg-chart-title-speed'] = {french: "Vitesse / Temps" , english: "Speed / Time"};
languages['lg-chart-title-acceleration'] = {french: "Acceleration / Temps" , english: "Acceleration / Time"};
languages['lg-chart-title-drag-linear'] = {french: "Traînée (linéaire) / Temps" , english: "Drag (linear) / Time"};
languages['lg-chart-title-drag-log'] = {french: "Traînée (logarithmique) / Temps" , english: "Drag (logarithmic)/ Time"};
languages['lg-chart-title-mass'] = {french: "Masse du module / Temps" , english: "BuilderModule Mass / Time"};
languages['lg-error-copy-clipboard'] = {french: "Erreur pendant la copie vers le presse-papier" , english: "Error while copying image to Clipboard"};
languages['lg-error-copy-clipboard-not-supported'] = {french: "Le copie d'image png vers le press-papier n'est pas supportée par votre navigateur" , english: "Copying png image to Clipboard is not supported by your browser"};
languages['lg-print-pdf'] = {french: "Imprimer le Pdf" , english: "Print as Pdf"};
languages['lg-copy-to-clipboard'] = {french: "Copier vers le presse-papier" , english: "Copy to ClipBoard"};
languages['lg-save-as-pdf'] = {french: "Télécharger le Pdf" , english: "Save as Pdf"};
languages['lg-save-as-png'] = {french: "Télécharger l'image Png" , english: "Save as Png"};
languages['lg-auto-scale'] = {french: "Échelle Auto" , english: "Auto Scale"};

languages['lg-params-h'] = {french: "Altitude" , english: "Altitude"};
languages['lg-params-v'] = {french: "Vitesse" , english: "Speed"};

languages['lg-alert-no-grid-available'] = {french: "La grille n'existe pas encore." , english: "Grid doesnt exist yet."};
languages['lg-no-print-local'] = {french: "Il n'est pas possible d'imprimer car vous utilisez la version locale du simulateur, et la quantité de données est trop grande." , english: "Printing not enabled because you are using the local version of the Rocket Simulator and your dataset is too large."};
languages['lg-no-print-remote'] = {french: "Il n'est pas possible d'imprimer car vous  la quantité de données est trop grande. Vous pouvez tout de même télécharger un Pdf ou un fichier Excel" , english: "Printing not enabled because your dataset is too large. You can still download the data as a PDF or XLSX file."};
languages['lg-no-full-dataset'] = {french: "Il n'est pas possible d'afficher toutes les données: la quantité trop grande. Nous divisons le pas par 10." , english: "Not Showing all data. Restricting step to 0.1. You won't be able to Print the grid."};





window.RocketLanguages = languages;

// TODO : use Languages.get everywhere, and set currentLanguage via setLanguage()

export default class Languages {
    static currentLanguage = 'french';

    static setLanguage(language) {
        self.currentLanguage = language;
    }
    static get(key) {
        //console.log('GET Language', key, Languages.currentLanguage)
        //console.log(RocketLanguages);
        if (typeof RocketLanguages[key] === 'undefined') {
            if (typeof RocketLanguages['lg-'+key] === 'undefined') {
                return key;
            } else {
                return RocketLanguages['lg-'+key][Languages.currentLanguage];
            }
        }
        return RocketLanguages[key][Languages.currentLanguage];
    }
}


window.Languages = Languages;