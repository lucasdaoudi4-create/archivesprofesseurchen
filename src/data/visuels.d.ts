/** Une dérivée : sa largeur rendue et sa hauteur, pour poser le ratio. */
export interface Derivee {
    readonly l: number;
    readonly h: number;
}
export interface Visuel {
    /** Racine du nom ARC, sans le format ni l'extension. */
    readonly base: string;
    /** Les dérivées disponibles, par largeur croissante. */
    readonly derivees: readonly Derivee[];
    /** Texte de remplacement. Décrit la scène, pas le fichier. */
    readonly alt: string;
    /**
     * L'aplat de chargement — § 7.13.5 : « aplat de couleur pris dans la table
     * LQIP des tokens, pas de flou progressif, pas d'effet de balayage ». La
     * valeur est un NOM DE JETON, pas une couleur : la table vit dans
     * `01-tokens-couleur.css`, et une image ne redéfinit pas une couleur du
     * système. Le cadre le lit en `background-color` et la photo se peint
     * par-dessus — il n'y a rien à fondre, donc rien à synchroniser.
     */
    readonly aplat: string;
}
/** Construit le chemin d'une dérivée dans un encodage donné. */
export declare function chemin(v: Visuel, d: Derivee, ext: "avif" | "webp" | "jpg"): string;
/** Construit l'attribut `srcset` complet d'un encodage. */
export declare function jeuSources(v: Visuel, ext: "avif" | "webp" | "jpg"): string;
/** La dérivée de tête : la plus grande, celle qui pose le rapport de forme. */
export declare function repli(v: Visuel): Derivee;
export declare function secours(v: Visuel): Derivee;
/** Le ratio de la plus grande dérivée, à poser en CSS pour réserver la place. */
export declare function ratio(v: Visuel): number;
/** Jumeau de `--bp-planche`. Au-dessus, la scène du héros est une colonne. */
export declare const BP_PLANCHE = "620px";
/** Jumeau de `--bp-paillasse`. Au-dessus, les splits sont dépliés. */
export declare const BP_PAILLASSE = "980px";
/** La fenêtre où `.wrap` atteint son plafond de 1140 px. Pas un palier. */
export declare const W_WRAP_PLEIN = "1240px";
/** La condition qui bascule le héros sur le cadrage en colonne (4:3). */
export declare const CADRAGE_COLONNE = "(min-width: 620px)";
export declare const TAILLES_SCENE = "(min-width: 980px) max(49vw, 853px), 100vw";
export declare const TAILLES_NOTICE = "(min-width: 1240px) 542px, (min-width: 980px) 44vw, 92vw";
export declare const TAILLES_PORTRAIT = "(min-width: 1240px) 437px, (min-width: 980px) 36vw, 24rem";
export declare const TAILLES_PLANCHE_404 = "50vw";
export declare const TAILLES_AFFICHE = "(min-width: 1240px) 1140px, 92vw";
export declare const plateauLarge: Visuel;
export declare const plateauHaut: Visuel;
export declare const narrateurPortrait: Visuel;
export declare const narrateurPlanDeFace: Visuel;
