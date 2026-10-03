Structural and Multidisciplinary Optimization (2025) 68:92 https://doi.org/10.1007/s00158-025-04022-x

**RESEARCH PAPER**

# Multivariate adaptive regression splines for two‑stage design optimization of bio‑inspired drilling into the lunar regolith

**Liang Zhang<sup>1</sup> · Yuxin Yuan<sup>1</sup> · Jiajie Cheng<sup>1</sup> · Lei Wang<sup>1</sup>**

Received: 19 February 2025 / Revised: 2 April 2025 / Accepted: 17 April 2025

© The Author(s), under exclusive licence to Springer-Verlag GmbH Germany, part of Springer Nature 2025

**Abstract**

This paper proposes an adaptively updating two-stage multi-objective optimization design framework based on Multivari- ate Adaptive Regression Splines (MARS) for the design of the bio-inspired drill into the lunar regolith. In this framework, the geometry parameters and the controlling strategies are optimized in Stage 1 and Stage 2, respectively, aided by discrete element modeling of the bio-inspired drilling process. Minimizing construction cost and total power consumption are the design objectives in Stage 1, whereas maximizing drilling effectiveness and drilling efficiency are the design objectives in Stage 2. The Pareto front-based design optimization method is utilized to identify the optimal design in each stage. The optimal geometry design from Stage 1 is adopted for the design optimization of controlling strategies in Stage 2 and the optimal design in Stage 2 is determined as the final design of the lunar drill. The selected design space in each stage is first discretized with coarse intervals for MARS model construction. Then the design objectives in the global design space are predicted by MARS. The optimal design derived from MARS is iteratively added to train the MARS model until the optimal design is converged. A comparison between the optimal design with and without the MARS model validates the superiority of the adaptively updating MARS-based optimization framework. The proposed framework provides an efficient solution and valuable insights for the optimal design of a bio-inspired drill into the lunar regolith, which will set the stage for the design of bio-inspired tools and technologies applicable to other extraterrestrial environments.

**Keywords** Lunar regolith · Bio-inspired · Discrete element method · Multivariate adaptive regression splines · Optimization

# Introduction

In recent years, there has been a growing global interest in lunar exploration among countries and organizations. As an almost unlimited resource on the Moon, the lunar regolith presents significant potential for construction and habita- tion on the Moon, contributing to extraterrestrial technol- ogy development and providing forward-looking solutions to challenges like resource scarcity and population pressures on Earth (Zhang et al. [2021](#_bookmark69)). In situ drilling is one of the most effective and straightforward approaches to understanding

Responsible editor: Qing Quan Liang

 Lei Wang

[wang4li@ucmail.uc.edu](mailto:wang4li@ucmail.uc.edu)

<sup>1</sup> Department of Civil and Architectural Engineering

and Construction Management, University of Cincinnati, Cincinnati, OH 45221, USA

the properties of the lunar regolith (Zhang and Ding [2017](#_bookmark62); Zhang et al. [2019a](#_bookmark67), [b](#_bookmark68); Jayathilake et al. [2022](#_bookmark44)). Although terrestrial drilling technology is well-developed, directly adapting it for lunar exploration remains challenging due to limited knowledge about the lunar regolith, lack of human involvement, high transportation costs, and harsh lunar environmental conditions (Zhang et al. [2024](#_bookmark71)). To this end, many attempts have been made to improve lunar drilling performance. For example, Tang et al. ([2016](#_bookmark54)) developed a real-time drilling strategy based on the rate of penetration to recognize real-time drilling conditions and used support vector machines to evaluate the drillability levels, achieving adaptively tuned drilling parameters to satisfy the recog- nized drilling conditions. Zhang et al. ([2016](#_bookmark65)) developed a drilling test bed capable of reaching a depth of 2.2 m and introduced a control strategy utilizing online monitoring signals to enhance drilling performance. Zhang and Ding ([2017](#_bookmark62)) formulated a numerical model to predict penetration force and rotational torque in lunar regolith drilling, aiding

in the design of drill tools for deep regolith exploration. Tian et al. ([2022](#_bookmark57)) proposed a virtual soil pile method to investi- gate drill-regolith interactions. Parameter sensitivity analy- sis using this model provided a theoretical foundation for determining the mechanical properties of lunar soil based on drill vibration feedback signals. Yuan et al. ([2024](#_bookmark60)) designed an autonomous self-burrowing drilling system based on the Archimedes screw principle.

Bio-inspired designs (e.g., clam-inspired designs) have recently gained significant attention in Earth-based geotech- nical engineering and provide energy-efficient solutions for advancing drilling technology for advanced geotechnical in situ characterization (Martinez et al. [2022](#_bookmark50); Zhang et al. [2023](#_bookmark70)). The bio-inspired drilling design is usually a small- size design, reducing the highly expensive transportation cost from Earth to the Moon. The bio-inspired drilling strat- egy also provides an energy-efficient alternative by leverag- ing cyclic motion and minimalist control strategies, reduc- ing overall energy consumption during drilling and avoiding reliance on large equipment (e.g., driving hammers and cranes) that are not applicable on the Moon. Bio-inspired drilling assists anchoring and self-propulsion strategies observed in the burrowing organisms to enhance penetration efficiency without requiring excessive external force, which is well suitable for the low-gravity environment of the Moon. Some terrestrial approaches have proven beneficial for cre- ating efficient, low-cost, and sustainable tools on Earth (Tao et al. [2020](#_bookmark56); Zhao et al. [2021](#_bookmark72); Chen et al. [2022a](#_bookmark30), [b](#_bookmark31)) and may also enhance lunar drilling technology. Researchers have effectively captured the mechanisms of clam-inspired drilling through numerical modeling using the discrete ele- ment method (DEM), providing valuable insights into this innovative approach (Huang and Tao [2020a](#_bookmark39), [b](#_bookmark40); Chen et al. [2021](#_bookmark29), [2022a](#_bookmark30), [b](#_bookmark31)). To implement the bio-inspired strategy for lunar drill design, Zhang et al. ([2024](#_bookmark71)) proposed a Pareto front-based multi-objective design optimization framework to optimize all the parameters involved in the bio-inspired drilling into lunar regolith. However, in this routine multi- objective design optimization framework (e.g., Zhang et al. [2024](#_bookmark71)), the continuous design space is discretized into small subdomains with some coarse intervals, which are subjected to computational burden and the manufacturing techniques or determined by engineering experience. Consequently, only a limited number of designs from either continuous or discrete design spaces are calculated and selected as candi- date designs. To this end, the optimal design is implicitly assumed to be one of these preset candidate designs, which could omit the true optimal design that is excluded from the preset designs. Further refining the design space can reduce the optimization error but may significantly increase the computational burden, especially for high-dimensional design problems. To address this issue, some surrogate mod- els have been attempted to be applied to the optimization

framework to predict design objectives in the selected design space but with refined intervals (Kotti et al. [2014](#_bookmark46); Changli et al. [2015](#_bookmark28); Wang et al. [2023](#_bookmark59)). However, the knee point (i.e., the optimal design) is quite sensitive to the derived Pareto front. Even a slight error from surrogate models could shift the true Pareto front and result in an inaccurate optimal design. Therefore, validating the knee point is essential for surrogate model-based design optimization, which has not been considered in previous studies.

This paper proposes an adaptively updating two-stage multi-objective optimization design framework based on sur- rogate models built with Multivariate Adaptive Regression Splines for the bio-inspired drill design into the lunar rego- lith. In Stage 1, the geometry design parameters (i.e., anchor height, anchor shape, and cone apex angle) are optimized with the design objectives focused on minimizing construc- tion cost and total power consumption. These two objectives serve as a reference for the total investment required to com- plete the drilling mission. To address the conflicting goals of minimizing construction cost and total power consump- tion, a Pareto front composed of non-dominated designs is generated using the NSGA-II sorting algorithm (Deb et al. [2002](#_bookmark33); Tang et al. [2019](#_bookmark55); Li et al. [2022](#_bookmark47)). A knee point on the Pareto front is identified as the optimal drill geometry. Based on the optimal drill geometry design from Stage 1, the controlling strategies adopted for penetration in terms of downward velocity, rotation velocity, expansion veloc- ity, and anchor-cone distance are optimized in Stage 2. In this stage, maximizing the drilling effectiveness and drilling efficiency are established as the two design objectives. The optimal controlling strategies with optimal geometry param- eters in Stage 2 are obtained through similar optimization procedures as in Stage 1. The selected design space in each stage is first discretized with coarse intervals for Multivariate Adaptive Regression Splines (MARS) model construction. Then the design objectives in the design space with a refined interval are predicted by MARS for the design optimization in each stage. The optimal design derived from the design space with a refined interval is iteratively added to train the MARS model until the optimal design is converged. To min- imize prediction errors of the Pareto front and maximize the use of calculated data, only the design objectives for the uncalculated design combinations are predicted. The unique contributions of this study are: (1) An adaptively updating multi-objective design optimization framework is proposed to achieve an optimal design across the entire design space instead of searching the optimal design in the limited pos- sible candidate designs, resulting in a more accurate optimal design; (2) The proposed approach can yield a Pareto front comprising a greater number of design points compared to the traditional method, demonstrating its capability in identifying more potential optimal solutions and enhancing decision-making flexibility; (3) The additional integrated

conceptually simple Grid Search and MARS do not much increase the complexity of the traditional approach, achiev- ing significant promise for practical design applications.

The remainder of this paper is organized as follows. First, the principles and model configuration of MARS are briefly reviewed. Then the adaptively updated two-stage multi-objective design optimization framework is intro- duced, where both numerical modeling of the bio-inspired drilling process and implementation procedures of the pro- posed framework are presented. Afterward, the efficiency and effectiveness of MARS in optimizing the design of a bio-inspired drill for lunar regolith are demonstrated. To fur- ther illustrate the advantages of using MARS in design opti- mization, a comparison between the optimal designs with and without the MARS model is presented. The knee point,

coefficient of the _m_th basis function (BF) and is estimated by the least-squares method; _β<sub>m</sub>_(_X_) is the _m_th BF; _M_ is the number of BFs. Although either linear or cubic functions can be adopted as BFs in MARS (Friedman [1991](#_bookmark34)), linear functions are more popular in previous studies such as the analysis of the slope stability (Shiau and Keawsawasvong [2023](#_bookmark52)) and the horizontal wall deflection of the braced exca- vations (Zhang et al. [2019a](#_bookmark67), [b](#_bookmark68)), and could be preferable in some problems (Bardhan et al. [2021](#_bookmark27)). In this study, linear functions are selected as basis functions. Piecewise linear basis functions are of the form max(0,_x_ − _t_) with a knot at the value _t_. The equation means that only the positive part of the segment is used otherwise it is given a zero value, which can be expressed as:

Pareto front, and feature relative importance from MARS are discussed. Finally, conclusions are drawn based on the

max(0, _x_ − _t_)= _x_ − _t_, if _x_ ≥ _t_

0, otherwise

(3)

results presented.

# Predicting the performance

**of a bio‑inspired drill into lunar regolith using MARS**

## Principles of MARS

The multivariate adaptive regression splines (MARS) algo- rithm proposed by Friedman ([1991](#_bookmark34)) is a nonparametric and nonlinear regression method. Due to its high accuracy and high efficiency, MARS has been widely used in vari- ous geotechnical areas such as braced excavations (Zhang et al. [2017](#_bookmark66); Zhang [2020](#_bookmark61)), tunnels (Goh et al. [2018](#_bookmark35)), slopes (Wang et al. [2020](#_bookmark58); Chen et al. [2024](#_bookmark32)), site investigations (Qi et al. [2021](#_bookmark51)), foundations (Zhou et al. [2021](#_bookmark73)), and pave-

As illustrated in Fig. [1](#_bookmark0), a MARS model is built through two general phases: the forward phase and the backward phase. In the forward phase, MARS starts with a simple constant term model that initially contains no basis func- tions. The model is improved by sequentially searching for new knots and adding the BF that minimizes the fitting error until the preset maximum number _M_<sub>max</sub> of BFs (defined by the user) is reached (Zhang and Goh [2013](#_bookmark63); Qi et al. [2021](#_bookmark51)). As more knots and terms are added to the MARS model, the model accuracy and the model fitting can reach a high level but also could lead to overfitting. In the backward phase, the best model is identified by removing the basis functions with the lowest contribution to the model until a sub-model with a minimum value of generalized cross-validation (GCV) is found and selected as the best model. The GCV in a MARS model can be calculated as (Zhang and Goh [2013](#_bookmark63), [2016](#_bookmark64))

ments (Bardhan et al. [2021](#_bookmark27)). MARS captures the nonlinear

1 ∑_N_

\[_y_ − _f_ (_x_ )\]<sup>2</sup>

relationship between input variables and output through a series of piecewise polynomial splines known as basis func- tions (BFs) without any assumptions about the underlying

GCV = _N i_\=1 _i i_

\[1 − _m_+_d_×(_m_−1)∕2 \]2

_N_

(4)

functional relationship between input variables and output. Compared to other surrogate models, MARS provides a closed-form solution to represent the relationship between the input variables and output, enhancing the usability of MARS in practice.

Let _y_ be the output and **_X_** \= (_x_<sub>1</sub>, _x_<sub>2</sub>, …, _x_<sub>p</sub>) be the input variables. Then the output can be formulated as

where _m_ is the number of BFs in the current MARS model;

_d_ is the penalizing parameter; _N_ is the number of observa- tions; and _f_(_x<sub>i</sub>_) denotes the _i_th predicted value in the MARS model. The numerator represents the mean squared error of the evaluated model on the training data, adjusted by the denominator to account for model complexity. The denomi- nator incorporates the increasing variance associated with higher model complexity. Additionally, (_m_ − 1)/2 corre-

_y_ \= _f_ (_X_) + _ε_

_f_ (_X_)= _a_0 + ,

_M_

_m_\=1

_amβm_(_X_)

(1)

(2)

sponds to the number of hinge function knots. The GCV criterion penalizes both the quantity of basis functions in the model and the number of knots. The model generalization increases with more basis functions pruned down. Finally, a trade-off between model accuracy and model generaliza-

where _ε_ is the prediction error; _f_(_X_) denotes the estimated response variable; _α_<sub>0</sub> is a constant coefficient; _α<sub>m</sub>_ is the

tion is reached in the backward phase. The MARS method is currently built in the software packages of ‘‘earth” in the R

**Fig. 1** Principles of multivariate adaptive regression splines

platform and the ARESLab toolbox of MATLAB (Qi et al. [2021](#_bookmark51)). The ARESLab toolbox of MATLAB is implemented in this study.

## Hyperparameter optimization using Grid Search

Three key hyperparameters, the maximum number of terms (_M_<sub>max</sub>), the maximum level of variable interaction (_I_<sub>max</sub>), and the penalizing parameter (_d_) should be defined before MARS model construction (Luat et al. [2020](#_bookmark49)), which is denoted as **_H_** \= {_M_<sub>max</sub>, _I_<sub>max</sub>, _d_}. These hyperparameters are critical for controlling the model’s complexity and its ability to generalize. _M_<sub>max</sub> serves as a stop criterion in the forward phase; _I_<sub>max</sub> determines the combination types of the Basis Functions; _d_ is a smoothing parameter that penalizes both the number of basis functions and the number of knots to avoid overfitting in the backward phase. Optimizing these parameters is essential for enhancing the predictive accu- racy of the MARS model. Grid Search is a conceptually simple and straightforward approach for hyperparameter optimization in machine learning. It exhaustively explores all possible combinations within a predefined hyperparam- eter grid, significantly increasing the chances of identifying the optimal configuration for a given model. The proposed design optimization framework, integrating the conceptually simple yet effective Grid Search with MARS, has significant

promise for practical design applications. Therefore, Grid Search is adopted to optimize the hyperparameters in MARS in this study.

In Grid Search, a grid of all possible hyperparameter combinations is systematically generated within a specified range with the upper and lower bounds of each hyperpa- rameter. For each combination, the model is repeat-trained and evaluated by model performance metrics (e.g., Root Mean Squared Error), which requires examining the mini- mum repetitions needed for the metric to converge. Root Mean Squared Error (_RMSE_) is selected as the model per- formance metric for MARS models. To improve the model robustness, the MARS model should be retrained several times for each hyperparameter combination. An example in Fig. [2](#_bookmark1) demonstrates that 500 repetitions are required for the MARS model with **_H_** \= {16, 3, 0.5} to achieve convergence of _RMSE_ in two stages. Therefore, 500 repetitions are con- ducted for all the MARS model constructions. After testing all combinations, the one yielding the minimum _RMSE_ is selected as the optimal configuration. Although computa- tionally demanding, Grid Search ensures a thorough explora- tion of the hyperparameter space, maximizing the model’s performance and reliability.

In this study, ranges of hyperparameters in MARS for

Grid Search are summarized in Table [1](#_bookmark2). Based on the mean- ing of these parameters, _M_<sub>max</sub> and _I_<sub>max</sub> are integers while _d_ is a float. The selection of these specific hyperparameter ranges

**Fig. 2** Convergence of mean and standard deviation (SD) of _RMSE_

with iterations using MARS

**Table 1** Ranges of hyperparameters in MARS for Grid Search in this study

Stage Hyperparameter Range Increment

1.  Maximum number of terms, _M_<sub>max</sub> \[1,20\] 1 Maximum level of variable interaction, \[1,9\] 1

_I_max

Penalizing parameter, _d_ \[0,4\] 0.5

1.  Maximum number of terms, _M_<sub>max</sub> \[1,50\] 1 Maximum level of variable interaction, \[1,9\] 1

_I_max

Penalizing parameter, _d_ \[0,4\] 0.1

was based on a balance between computational burden and model flexibility: (1) Maximum number of terms (_M_<sub>max</sub>): The range was chosen to ensure that the model captures suf- ficient complexity while avoiding overfitting. A lower limit of 1 represents a minimal model, whereas the upper limits (20 and 50 in different stages) allow for progressively more complex models. Sensitivity analysis showed that beyond the selected upper limits for each stage, performance gains were negligible while computational cost increased significantly;

(2) Maximum level of variable interaction (_I_<sub>max</sub>): The range of \[1,9\] was selected to control interaction complexity. Set- ting _I_<sub>max</sub> too high can lead to an overly complex model. Sensitivity analysis indicated that increasing _I_<sub>max</sub> beyond 9 did not provide significant improvements in predictive per- formance; (3) Penalizing parameter (_d_): Lower values of _d_ allow the model to capture more variations, while higher values impose stronger regularization. Friedman ([1991](#_bookmark34)) recommended a range of \[2,4\] for _d_. Preliminary sensitive studies indicated that the model performance of MARS was sensitive to this parameter so a broader range of \[0,4\] was determined for _d_ in this study. The increment (0.5 and 0.1 in different stages) was selected based on preliminary sensitive studies to ensure adequate resolution in the search space for different complexity levels of the problem.

In Stage 1, there are 20 × 9 × 9 = 1620 combinations in

total, whereas there are 50 × 9 × 41 = 18,450 combinations in Stage 2. The Grid Search process required approximately

1.5 days for Stage 1 and approximately 12 days for Stage 2 using five computers equipped with an i9 12900K CPU @3.20 GHz. With affable computational burden, the con- ceptually simple and easy-to-implement Grid Search is quite suitable for the design optimization in this study. However, it could be computationally expensive for high-dimensional search spaces. Bayesian optimization and adaptive grid refinement could be alternatives for hyperparameter opti- mization in MARS in the face of high-dimensional prob- lems. Bayesian optimization iteratively refines the search space based on a surrogate model, reducing the number of required computations. Adaptive grid refinement utilizes coarse-grained searches to identify promising parameter ranges before finer searches are conducted.

# Adaptively updating multi‑objective design optimization framework

**for a bio‑inspired drill into the lunar regolith**

In this section, the numerical modeling of the bio-inspired drilling process is first presented. Then the proposed adap- tively updated two-stage design optimization framework is introduced. Finally, detailed implementation procedures of the proposed framework are summarized.

## Numerical modeling of bio‑inspired drilling process

The clam features a slender, rigid shell, two convex shell valves, and a stretchable foot, as depicted in Fig. [3](#_bookmark3)a. The bio- inspired drilling process can be divided into three phases: cone penetration (Phase I), anchor expansion (Phase II), and self-penetration (Phase III), as illustrated in Fig. [3](#_bookmark3)b. A 3D

**Fig. 3** Numerical modeling of bio-inspired drilling process

discrete element method (DEM)-based program, Particle Flow Code (PFC<sup>3D</sup>) version 7.0 (Itasca Consulting Group [2022](#_bookmark43)), is utilized to analyze the behavior of lunar regolith and to investigate the interactions between the drill and the regolith. For numerical simulations, the clam’s geometry is simplified into a cylindrical shaft, a cone, and a cylindrical anchor. The geometry parameters (e.g., the height of the chamber _H_<sub>chamber</sub>, diameter of the chamber _D_<sub>chamber</sub>, diameter of the drill _D_<sub>shaft</sub>, length of the drill _L_<sub>shaft</sub>) are illustrated in Fig. [3](#_bookmark3)a. The chamber and the drill are modeled by the rigid wall elements in PFC. The lunar regolith is simulated using the lunar highlands simulant (LHS-1). The ball-to-ball con- tact model is set as linear contact with rolling friction (Chen et al. [2021](#_bookmark29)). In the linear contact model with rolling friction for ball-to-ball behavior, the coefficient of sliding friction _f_<sub>ps</sub>, coefficient of rolling friction _f_<sub>pr</sub>, effective modulus _E_<sup>\*</sup>, and normal-to-shear stiffness ratio _K_<sup>\*</sup> are calibrated by the laboratory triaxial consolidated drained (CD) tests. During the laboratory test, the principal stress ratio (i.e., maximum principal stresses over minimum principal stresses, _σ_ /_σ_ )

|     |     |
| --- | --- |
| Parameter | Value |
| Particle density, _ρ_ (kg/m<sup>3</sup>) | 2720 |
| Porosity, _n_ | 0.45 |
| Particle radius, _r_<sub>p</sub> (m) | 0.004 |
| Damping coefficient, _γ_ | 0.7 |
| Ball-wall friction coefficient, _f_<sub>pw</sub> | 0.3 |
| Coefficient of sliding friction, _f_<sub>ps</sub> | 0.9 |
| Coefficient of rolling friction, _f_<sub>pr</sub> | 0.3 |
| Particle effective modulus, _E_<sup>\*</sup> (Pa) | 5 × 10<sup>7</sup> |
| Normal-to-shear stiffness ratio, _K_<sup>\*</sup> | 1.0 |
| Gravity, _g_ (m/s<sup>2</sup>) | 1.625 |

parameters can accurately capture the physical and mechani- cal behavior of the LHS-1 simulant. More details can be referred to Zhang et al. ([2024](#_bookmark71)). To this end, the input param- eters adopted for the numerical simulations are summarized in Table [2](#_bookmark4).

In the numerical modeling of the bio-inspired drill- ing process, the entire drill starts moving downward with a constant velocity of _V_<sub>D</sub>, and the cone is rotated with a constant velocity of _V_<sub>R</sub> in Phase I until the target depth is reached. In Phase II, the drill ceases both downward move- ment and rotation at the target depth reached in Phase I, and the anchor begins to expand at a velocity _V_<sub>E</sub>, defined as the

**Table 2** Input parameters adopted for the numerical simulations

1 3

with strain for the specimens made by LHS-1 simulant is

monitored. The curves of the principal stress ratio versus strain from the laboratory tests are taken as a benchmark for the DEM model calibration. The combination of _f<sub>ps</sub>_, _f<sub>pr</sub>_, _E_<sup>\*</sup> and _K_<sup>\*</sup> in the numerical model that results in the best match of the curves is selected as the optimal parameters for the DEM model, since the numerical model using these

rate of change of the anchor radius normalized by its initial radius. The expansion continues until the target expansion ratio is achieved. In Phase III, the drill resumes downward penetration at the velocity _V_<sub>D</sub> and rotates at _V_<sub>R</sub>, while the anchor ceases its expansion and moves upward at the same downward velocity _V_<sub>D</sub>. The coarse intervals are determined by the equally discretized approach within the design space for each design parameter, which is a common empirical approach in the design optimization of the geotechnical infrastructure (e.g., Gong et al. [2020](#_bookmark37); Huang et al. [2022](#_bookmark41); Hu et al. [2023](#_bookmark38)). The range of design space for each design parameter is mainly determined by following previous stud- ies (e.g., Chen et al. [2021](#_bookmark29); Tang and Tao [2022](#_bookmark53); Hunt et al. [2023](#_bookmark42)). In the equally discretized approach, the final step is to determine the number of coarse intervals. The selected coarse intervals should ensure: (1) There are enough can- didate values for each design parameter to ensure the effect of each design parameter can be well captured in the design optimization. Overly large intervals should be avoided; (2) Each pair of consecutive candidate values should result in significant differences in the design objectives, enhancing computational efficiency. Overly fine intervals are avoided. For example, indistinguishable designs such as anchor shapes _b_ \= 8r and _b_ \= 9r are skipped in this study; (3) After satisfying the two conditions above, a trade-off between the computational burden and design accuracy should be con- sidered. Based on the three conditions, the design space with the selected coarse interval for the MARS model construc- tion is tabulated in Table [3](#_bookmark6).

## Adaptively updated two‑stage multi‑objective design optimization framework

**for a bio‑inspired drill into the lunar regolith**

According to the bio-inspired drilling process, seven design parameters \[i.e., The anchor height (_H_), anchor shape (_b_), cone apex angle (_α_), downward velocity (_V_<sub>D</sub>), rotation veloc- ity (_V_<sub>R</sub>), expansion velocity (_V_<sub>E</sub>), and anchor-cone distance (_L_)\] are involved for the lunar drill design, which can be optimized in two stages (Zhang et al. [2024](#_bookmark71)). Stage 1 seeks the optimal geometry design parameters **_G_** (i.e., **_G_** \= {_H_, _b_,

_α_}) in the design space **_DS_** with the minimum construction cost **_C_** and minimum total power consumption **_W_**. The con- struction cost **_C_** and total power consumption **_W_** can be cal- culated by Eqs. ([A1](#_bookmark23)–[A5](#_bookmark26)) in Appendix. The multi-objective design optimization in the first step can be set up as:

Find: Drill geometry parameters **_G_**

Subjected to: Design space, **_DS_**

Objectives: Minimize the construction cost, **_C_**

Minimize the total power consumption, **_W_**

Figure [4](#_bookmark5) shows that a Pareto front can be formed by the non- dominated designs that are superior to the other designs. The non-dominated designs can be identified by algorithms such as Non‐dominated Sorting Genetic Algorithm version II (NSGA II) (Deb et al. [2002](#_bookmark33); Tang et al. [2019](#_bookmark55); Li et al. [2022](#_bookmark47), [2024](#_bookmark48)). The Pareto front effectively captures the trade- off relationship between two conflicting design objectives

**Fig. 4** Illustration of design optimization using Pareto front (modified from Gong et al. [2016](#_bookmark36)) (The design objectives are maximizing Objec- tive 1 and Objective 2)

**Table 3** Design space with coarse intervals for MARS model construction

Category Design parameter Design space

Drill geometry Anchor height, _H_ (m) 2r<sup>a</sup>, 2.5r, 3r, 3.5r, 4r, 4.5r, 5r

Anchor shape, _b_ (m) 3r, 4r, 5r, 6r, 7r, 10r

Cone apex angle, _α_ (°) 30, 60, 90, 120, 150, 180

Controlling strategies Downward velocity, _V_<sub>D</sub> (m/s) 0.01, 0.02, 0.03, 0.04

Rotation velocity, _V_<sub>R</sub> (rpm) 0, 100, 200, 300, 400

Expansion velocity, _V_<sub>E</sub> 0.01, 0.02, 0.03, 0.04

Anchor-cone distance, _L_ (m) 1r, 2r, 3r, 4r, 5r

<sup>a</sup>“r” is denoted as the shaft radius of the drill

(e.g., maximizing Objective 1 versus maximizing Objective 2). A knee point on the Pareto front is the best-compromised design and is selected as the optimal design, which can be identified by the single-objective optimization-based algo- rithm proposed by Gong et al. ([2016](#_bookmark36)). Both in Stage 1 and Stage 2, the single-objective optimization‐based algorithm from Gong et al. ([2016](#_bookmark36)) is adopted for identifying the optimal design. In the single-objective optimization‐based algorithm, a utopia design is defined as a design with the two opti- mal design objective values simultaneously and cannot be obtained in practice due to a conflicting relationship between the two objectives, as shown in Fig. [4](#_bookmark5). The design objective values from the designs on the Pareto front (also known as non-dominated designs) and the utopia design should be normalized into values ranging from 0.0 to 1.0 by the Min–Max normalization method to eliminate scale effects for different design objectives. If two design objective values of _i_th non-dominated design with design parameters (DP) is

**_f_** _i_(**_DP_**)= \[_fi_,1(**_DP_**), _fi_,2(**_DP_**)\], the normalized design objec-

tive values denoted as **_f_** <sup>norm</sup>(**_DP_**)= \[_f_ <sup>norm</sup>(**_DP_**), _f_ <sup>norm</sup>(**_DP_**)\]

multi-objective design optimization in the second step for optimizing the controlling strategies can be set up as:

Find: Controlling strategies, **_CS_**

Subjected to: Design space, **_DS_**

Objectives: Maximize drilling effectiveness, **_E_**<sub>1</sub>

Maximize drilling efficiency, **_E_**<sub>2</sub>

The knee point (i.e., the optimal design) can be obtained following Stage 1. The optimal design in Stage 2 will be determined as the final optimal design for the bio-inspired drilling.

Using the calculations from the preset design space with

coarse intervals, a feasible design satisfying the engineering

_i i_,1 _i_,2

for this design can be obtained by the following equations:

requirements can be obtained, as illustrated in Fig. [5](#_bookmark7). How-

ever, these limited calculated designs are usually sparsely

_f_ norm(**_DP_**)= _fi_,1(**_DP_**)− \[_fi_,1(**_DP_**)\]min

(5)

distributed throughout the entire design space, which may

_i_,1

norm

\[_fi_,1(**_DP_**)\]max − \[_fi_,1(**_DP_**)\]min

_fi_,2(**_DP_**)− \[_fi_,2(**_DP_**)\]min

fail to accurately capture the performance of the design

system across the whole design space. The error is more pronounced in high-dimensional design space, as larger

_fi_,2 (**_DP_**)=

\[_f_

_i_,2

(**_DP_**)\]max

– \[_fi_,2

(**_DP_**)\]min

(6)

remaining design subdomains are not explored. In contrast, performance in uncalculated design subdomains can be pre-

where \[_fi_,1(**_DP_**)\]max and \[_fi_,1(**_DP_**)\]min are the maximum and minimum values of the first design objective, respectively; \[_fi_,2(**_DP_**)\]max and \[_fi_,2(**_DP_**)\]min are the maximum and mini- mum values of the second design objective, respectively. As such, the normalized design objective values for the utopia

design in F ig. [4](#_bookmark5) ar e **_f_** <sup>norm</sup> (**_DP_**) =

utopia

( ), _f_

dicted by surrogate models such as MARS, leading to an improved optimal design. Considering the knee point (i.e., the optimal design) is sensitive to the Pareto front, the knee point obtained by MARS is iteratively recalculated to update the trained MARS models and optimal design until the knee point is converged or the maximum iterations are reached.

norm utopia,1

\[_f_

**_DP_** norm utopia,2

(**_DP_**)\]= (1, 1). Then a knee point on the

Pareto front with minimum Euclidean distance from this

design to the utopia design (i.e., closest to the utopia design) in the normalized space is derived as the most preferable design. The Euclidean distance between _i_th non-dominated design and the utopia design in the normalized space can be calculated as:

_d_(**_f_** <sup>norm</sup>(**_DP_**), **_f_** <sup>norm</sup> (**_DP_**))

## Implementation procedures of the proposed framework

As illustrated in Fig. [6](#_bookmark8), The implementation procedures of the proposed adaptively updating multi-objective design optimization framework are summarized in the following steps:

_i_ utopia

\= √(**_f_** <sup>norm</sup>(**_DP_**)− **_f_** <sup>norm</sup> (**_DP_**))_T_ (**_f_** <sup>norm</sup>(**_DP_**)− **_f_** <sup>norm</sup> (**_DP_**))

(7)

_i_ utopia _i_

utopia

Step 1: Conceptualize the bio-inspired drilling problem

where (**_f_** <sup>norm</sup>(**_DP_**)− **_f_** <sup>norm</sup> (**_DP_**))_<sup>T</sup>_ is the transpose of the dif-

_i_ utopia

and build the numerical model. Herein, the drill geometry and controlling strategies to be designed

ference vector of **_f_** <sup>norm</sup>(**_DP_**)− **_f_** <sup>norm</sup> (**_DP_**).

_i_ utopia

After the optimal geometry is identified, the second step is to determine optimal controlling strategies **_CS_** (**_CS_** \= {_V_<sub>D</sub>, _V_<sub>R</sub>, _V_<sub>E</sub>, _L_}). The drilling effectiveness **_E_**<sub>1</sub> and drilling efficiency **_E_**<sub>2</sub> are evaluated in Stage 2, which can be calculated by Eqs. ([A6](#_bookmark24)–[A8](#_bookmark25)) in Appendix. To this end, the

for the bio-inspired drilling into lunar regolith are

focused. A numerical solution model is built to capture the regolith behavior and the interactions between the drill and the lunar regolith.

**Fig. 5** The superiority of surrogate models on the design optimization of the lunar drilling tools. (The color of the mesh represents the perfor- mance level predicted by the surrogate model). (colour figure online)

Step 2: Determine the design space **_DS_** of the drill geom- etry. Typically, discrete design space can be adopted for the optimization of the bio-inspired drill, which generally depends on the manufac- turing technique and engineering experience. For the cone apex angle _α_, limited integral angles are used in practice (Hunt et al. [2023](#_bookmark42)) whereas the anchor shape parameter _b_ and anchor height _H_ can be floating numbers normalized by the drill diam- eter in this study. A continuous design space **_DS_** is first divided into a discrete number of designs with coarse intervals as shown in Table [3](#_bookmark6). With the built numerical solution model, construction cost **_C_** and total power consumption **_W_** can be evaluated using Eqs. ([A1](#_bookmark23)–[A5](#_bookmark26)) in the Appendix for different design combinations in the design space **_DS_**.

Step 3: Establish MARS models with the calculated con- struction cost and the total power consumption. Note that the construction cost can be directly calculated in Stage 1. Only the total power con- sumption is predicted by MARS in Stage 1. In the hyperparameter optimization of MARS, total _N<sub>H</sub>_ possible hyperparameter combinations are set up with the upper and lower bounds of each hyper- parameter. The hyperparameters of the _j_th MARS model are initialized as _H<sub>j</sub>_ \= {_M_<sub>max,</sub>_<sub>j</sub>_, _I_<sub>max,</sub>_<sub>j</sub>_, _d<sub>j</sub>_}. The _j_th MARS model is trained with a random 70% of the dataset in Stage 1, and _R_<sup>2</sup>_<sub>j</sub>_ and _RMSE<sub>j</sub>_ are calculated for the remaining testing set until 500 repetitions are reached. 500 repetitions ensure the convergence of the mean and standard deviation

(SD) of _RMSE_ during MARS model training in two stages, as shown in Fig. [2](#_bookmark1). The MARS model with minimum average _RMSE_ across iterations is selected as the best MARS model among total _N<sub>H</sub>_ possible hyperparameter combinations.

Step 4: Revisit the design space and divide the design space into a discrete number of designs with refined intervals. Calculate the construction cost, and predict the total power consumption in the refined discrete design space using MARS.

Step 5: Construct the Pareto front from the calculated data, and the predicted data from the MARS model. To make full use of the calculated data and reduce the error on the Pareto front, only the design objec- tives for uncalculated design combinations are pre- dicted by MARS. After all the potential designs are obtained, the non-dominated designs that are superior to the other designs are identified by the sorting algorithm of NSGA‐II, and a Pareto front is formed by these non-dominated designs. Gen- erally, some requirement is built to ensure a more reasonable design which is known as a feasible design. Herein, no restrictive condition is applied and all the candidate designs are assumed feasi- ble designs in Stage 1. A knee point on the Pareto front can be identified by the single‐objective opti- mization‐based algorithm from Gong et al. ([2016](#_bookmark36)), as shown in Fig. [4](#_bookmark5). For ease of illustration, when extra _i_ data points in total are added to train the MARS model, the trained MARS model is denoted

**Fig. 6** Flowchart for the MARS-based multi-objective design optimization of the lunar drilling tools

as Update _i._ Since no extra data point is added to update the MARS model, the MARS model in this step is denoted as Update 0.

Step 6: Evaluate the true construction cost and the total power consumption at the knee point. Although the MARS model can reach highly accurate pre- dictions of the total power consumption across the whole design space, a slight error may cause deviation in predictions of the knee point. There- fore, the true construction cost and the total power consumption at the predicted knee point should be calculated for validation to ensure an acceptable error for the optimal design. To this end, the true construction cost and the total power consumption at this initial knee point are added to the dataset to update the MARS model.

Step 7: Update the Pareto front and the knee point based on the _i_th updated MARS. Identify the _i_th knee point on the Pareto front as the optimal drill geom- etry design until there is no new knee point gener- ated from the updated MARS model or the maxi- mum iterations are reached to the preset threshold value. In this study, the maximum number of itera- tions is set to nine based on engineering experi- ence, both to reflect practical expectations and to prevent infinite loops in the event of divergence. This value can be adjusted depending on prior knowledge of the design problem or specific engi- neering judgment.

Step 8: Based on the optimal drill design, the controlling strategy design parameters are first determined and the preset design space is divided into a discrete number of designs with coarse intervals in Stage 2. Then the drilling effectiveness **_E_**<sub>1</sub> and drilling effi- ciency **_E_**<sub>2</sub> in the coarse discrete design space **_DS_** are evaluated using Eqs. ([A6](#_bookmark24)–[A8](#_bookmark25)) in the Appendix for all the designs.

Step 9: Repeat Steps 3–7. Obtain the optimal drilling con- trolling strategy design for bio-inspired lunar drills using MARS. The positive drilling effectiveness **_E_**<sub>1</sub> and positive drilling efficiency **_E_**<sub>2</sub> indicate that the adopted drilling strategies improve the tradi- tional drill design. Only these designs (with posi- tive values for **_E_**<sub>1</sub> and **_E_**<sub>2</sub>) will be selected as fea- sible designs for the optimization of controlling strategies. Then the multi-objective optimization and knee point concept will be used to identify the most preferred design in terms of optimal con- trolling strategies among these feasible designs.

Similar to Stage 1, the knee point from MARS will be iteratively added to update the MARS model until no new knee point is generated.

# Design optimization of bio‑inspired drilling using MARS

In this section, MARS is used to predict design objectives in two stages. _R_<sup>2</sup> and _RMSE_ are employed to quantify the model performance of MARS. Three iterations are found to be sufficient to reach the convergence of the knee point (i.e., the optimal design) in each stage, resulting in an early stop criterion than the condition that a maximum of nine itera- tions is reached in this study. The knee point can be identi- fied by the single-objective optimization‐based algorithm from Gong et al. ([2016](#_bookmark36)). The design objective values from each non-dominated design and the utopia design should be normalized by the Min–Max normalization method before calculating the Euclidean distance between each non-dom- inated design and the utopia design. Since the optimization results in the normalized space only serve as an auxiliary approach to identifying the knee point and the normalized design objective values lack practical significance, only the optimization results in the original space are presented in this study. The variations in _R_<sup>2</sup> and _RMSE_ with updated MARS models are analyzed to validate the efficiency and effectiveness of design optimization through MARS. A com- parison of the optimal design from calculations and MARS is performed to assess the accuracy of the optimization results from MARS.

## Design of drill geometry for the bio‑inspired drilling

Figure [7](#_bookmark10) shows that the MARS models for all the updates yield a high _R_<sup>2</sup> of 0.988 and a low _RMSE_ of approximately 0.40, indicating accurate predictions of total power con- sumption through MARS. It is reasonable to find that _R_<sup>2</sup> and _RMSE_ are quite stable because the initial MARS model is trained with large quantity data. Additional data do not significantly affect the updated MARS model. Furthermore, the initial MARS model has achieved high accuracy and more data may not considerably improve it. Basis Functions for the final MARS model are tabulated in Table [4](#_bookmark11), and the final MARS model is formulated in Eq. ([8](#_bookmark9)).

_W_\= 0.55818 + 0.5515\*BF1 + 0.87449\*BF2 - 1.0501\*BF3

(8)

Figure [8](#_bookmark12) shows the variation of Pareto font and knee point with updates. The knee point shifts slightly with updates of MARS. The final drill geometry design from MARS is

**Fig. 7** Predictions of total power consumption **_W_** using MARS in Stage 1

**Table 4** Basis Functions of final

Basis function Equation

design combinations are appropriately determined based on

MARS model for drill geometry

sound engineering experience. However, the optimal design

design in Stage 1

BF1 max(0, 0.2 − _a_)

BF2 max(0, _a_ − 0.6)

BF3 max(0, 0.6 − _a_)

remains the best among limited design combinations rather than representing the global design space for calculation with updates. It should also be noted that the updates from Fig. [8](#_bookmark12) cannot be obtained using the traditional approach, highlighting the capability of identifying potential optimal

_H_ \= 2r, _b_ \= 3r, and _α_ \= 63°, which has a lower construction cost and total power consumption than the optimal design from the initial calculations. Therefore, MARS can pro- duce a superior optimal design compared to the traditional approach. Since additional effort (i.e., more updates) is required for the proposed method, it may be more reasonable to compare the optimal design from MARS and calculation with updates for the same effort. MARS and calculation with updates yield the same optimal design, further validating the effectiveness of the updates from MARS. The identical opti- mal design from the two approaches may indicate the initial

designs compared to the traditional approach (Zhang et al. [2024](#_bookmark71)). Therefore, the superiority of MARS-based design optimization is sufficiently validated. Further discussions about the comparison are presented in Sect. [5](#_bookmark17).

## Design of controlling strategies for the bio‑inspired drilling

In Stage 2, both drilling effectiveness and drilling effi- ciency are predicted using MARS. Since Stage 2 has more design parameters to optimize and more design objectives to

**Fig. 8** The optimal drill geom- etry design in Stage 1 using MARS

predict, designing controlling strategies is a higher-dimen- sional problem than designing drill geometry. In this more complex and challenging design optimization problem, the performance of MARS is examined again.

As shown in Figs. [9](#_bookmark13) and [10](#_bookmark15), the MARS model achieves both a high _R_<sup>2</sup> and a low _RMSE_ for drilling effectiveness and drilling efficiency, indicating that MARS maintains high accuracy in high-dimensional design optimization problems. Figure [11](#_bookmark18) illustrates the variation of the Pareto front and the knee point in the original space in Stage 2. Note that the optimization results in Fig. [11](#_bookmark18) are mapped from the results from normalized space. Due to the scale effects for different

design objectives, the distance between each non-dominated design and the utopia design in the original space cannot represent that in the normalized space. Therefore, the design closest to the utopia design in the original space may not be the optimal design. Different from Stage 1, the knee point from MARS shifts dramatically after each update, highlight- ing the increasing difference in the Pareto front between MARS and the traditional approach for high-dimensional problems. The final MARS model in Stage 2 is formulated in Eqs. ([9](#_bookmark14), [10](#_bookmark16)) and its Basis Functions for this model are summarized in Table [5](#_bookmark19). The optimal design from MARS in Stage 2 is _V_<sub>D</sub> = 0.01 m/s, _V_<sub>R</sub> = 0, _V_<sub>E</sub> = 0.01, _L_ \= 1r, which

**Fig. 9** Predictions of drilling effectiveness _E_<sub>1</sub> using MARS in Stage 2

coincides with the optimal design in Stage 2 from calcula- tions with or without updates. The differences among the three approaches are discussed in Sect. [5](#_bookmark17). Finally, the opti- mal design for the bio-inspired drilling into lunar regolith from MARS is _H_ \= 2r, _b_ \= 3r, and _α_ \= 63°, _V_<sub>D</sub> = 0.01 m/s, _V_<sub>R</sub> = 0, _V_<sub>E</sub> = 0.01, _L_ \= 1r, whereas that from traditional approach (i.e., calculation without updates) is _H_ \= 2r, _b_ \= 3r, and _α_ \= 60°, _V_<sub>D</sub> = 0.01 m/s, _V_<sub>R</sub> = 0, _V_<sub>E</sub> = 0.01, _L_ \= 1r.

_E_<sub>1</sub> = 4.6872 − 5.5001\*BF1 − 0.25297\*BF2

\+ 0.46154\*BF3 + 20.338\*BF4 −0.10714\*BF5

– 0.60785\*BF6 − 2.9533\*BF7 − 6.5678\*BF8

– 9.3697\*BF9 +2.1891\*BF10 − 0.053182\*BF11

\+ 0.061852\*BF12 − 2.724\*BF13 +0.23788\*BF14

– 8.3251\*BF15 + 0.23262\*BF16 − 0.069005\*BF17

+4.432\*BF18 + 7.3793\*BF19 + 12.367\*BF20

– 0.23216\*BF21+1.6562\*BF22 − 0.36478\*BF23

– 0.89321\*BF24 + 5.9161\*BF25−5.7446\*BF26

\+ 0.070339\*BF27 + 0.071555\*BF28

\+ 0.28447\*BF29 + 0.1539\*BF30

(9)

**Fig. 10** Predictions of drilling efficiency _E_<sub>2</sub> using MARS in Stage 2

_E_<sub>2</sub>\= 1.2635 − 1.4163\*BF1 − 0.0027073\*BF2 − 0.0089329\*BF3 + 13.502\*BF4

−0.00071201\*BF5 − 0.075207\*BF6 − 9.2203\*BF7 − 3.6262\*BF8

+7.3613\*BF9 − 4.4906\*BF10 − 0.0041786\*BF11 + 0.0062027\*BF12

+0.55222\*BF13 − 6.2689\*BF14 + 1.1528\*BF15 + 0.024678\*BF16

−0.15859\*BF17 + 4.6503\*BF18 + 7.6827\*BF19 + 9.4296\*BF20

+0.0083223\*BF21 − 0.0095062\*BF22 + 0.014459\*BF23

−0.023667\*BF24 + 1.3823\*BF25 − 1.36\*BF26 + 0.16994\*BF27

+0.11399\*BF28 + 0.018943\*BF29 − 0.0026105\*BF30

(10)

# Discussion

In this section, the superiority of MARS-based multi-objec- tive design optimization framework over traditional design optimization framework is further discussed. The compari- son results indicate that the optimal design from MARS is more accurate and convincing. Feature relative importance from MARS quantifies the contribution of the design param- eters to the design objectives, which is unattainable in the traditional design optimization framework.

## Knee point

In Stage 1, the optimal drill geometry design from MARS exhibits lower construction cost and total power consumption

**Fig. 11** The optimal controlling strategy design in Stage 2 using MARS

**Table 5** Basis functions of final MARS model in predicting drill effectiveness and drilling efficiency

Basis function Equation

BF1 max(0, _V_R − 0.05)

BF2 max(0, _V_ − 0.5)

D

BF3 max(0, 0.5 − _V_D)

BF4 max(0, 0.05 − _V_ )∗ max(0, 0.05 − _V_ )

R D

BF5 BF2 ∗ max(0, _V_R − 0.5)

BF6 BF2 ∗ max(0, 0.5 − _V_ )

R

BF7 max(0, 0.05 − _V_R)∗ max(0, _V_D − 0.5)∗ max(0, _L_ − 0.25)

BF8 max(0, 0.05 − _V_ )∗ max(0, _V_ − 0.5)∗ max(0, 0.25 − _L_)

R D

BF9 BF4 ∗ max(0, _L_ − 0.5)

BF10 BF4 ∗ max(0, 0.5 − _L_)

BF11 max(0, _L_ − 0.5)

BF12 max(0, 0.5 − _L_)

BF13 BF3 ∗ max(0, 0.25 − _V_R)

BF14 max(0, 0.05 − _V_ )∗ max(0, _V_ − 1)

R D

BF15 max(0, 0.05 − _V_ )∗ max(0, 1 − _V_ )

R D

BF16 BF6 ∗ max(0, _V_ − 0.66667)

E

BF17 BF6 ∗ max(0, 0.66667 − _V_ )

E

BF18 BF15 ∗ max(0, _L_ − 0.5)

BF19 BF14 ∗ max(0, _L_ − 0.25)

BF20 BF14 ∗ max(0, 0.25 − _L_)

BF21 BF3 ∗ max(0, _V_ − 0.5)

R

BF22 BF3 ∗ max(0, 0.5 − _V_R)

BF23 max(0, _V_ − 0.5)

R

BF24 _BF_3 ∗ max(0, 0.75 − _V_R)

BF25 max(0, _V_ − 0.75)

R

BF26 max(0, 0.75 − _V_R)

BF27 max(0, 0.5 − _V_ )∗ max(0, _V_ − 0.66667)

R E

BF28 max(0, 0.5 − _V_R)∗ max(0, 0.66667 − _V_E)

BF29 BF5 ∗ max(0, _L_ − 0.5)

BF30 BF5 ∗ max(0, 0.5 − _L_)

compared to the traditional design optimization based on ini- tial calculations, as shown in Fig. [12](#_bookmark20), indicating that MARS can yield a more accurate optimal design. As illustrated in Fig. [12](#_bookmark20), during the iterative updates, several potential knee points (from Update 1 to Update 3) are identified. These additional points represent non-dominant designs relative to the calculated design combinations, suggesting that MARS is effective at searching for non-dominant designs (potential knee points) in the global design space. This conclusion is further supported by the optimization results in Stage 2.

In Stage 2, there are more design parameters and design objectives. Multiple design parameters and design objec- tives are very common and challenging in practice. Although MARS yields the same optimal design as that from the ini- tial or updated calculations, the updating process ensures that the optimal design from MARS is more convincing. As

shown in Fig. [13](#_bookmark21), there are more non-dominant designs on the Pareto front using MARS, indicating that the optimal design from MARS is the best in the global design space rather than among a limited set of design combinations based on engineering experience or constrained by com- putational limitations. Therefore, MARS also significantly reduces the reliance on the engineer’s experience in select- ing design combinations.

## Pareto front

Figures [12](#_bookmark20) and [13](#_bookmark21) show that the Pareto front from MARS includes more non-dominant designs. The Pareto front from both initial and updated calculations contains significant gaps between some adjacent non-dominant designs, which

**Fig. 12** Comparison of the most optimal drill geometry design from calculated data and that from the MARS model in Stage 1

may raise doubts about the identified optimal design since the true optimal design could be overlooked in these gaps. Additionally, some non-dominant designs can be updated by MARS, resulting in the updates of the Pareto front and the identification of more preferable designs outside the calcu- lated design combinations. Therefore, the Pareto front can

experience. In MARS, the contribution of each design parameter to the design objectives can be analyzed by the feature relative importance index (RII), which can be calcu- lated as (Keawsawasvong et al. [2024](#_bookmark45))

RII(_X_ )= Δ_GCV_(_Xi_)

_<sup>i</sup>_ max{Δ_GCV_(_X_ ), Δ_GCV_(_X_ ), ..., Δ_GCV_(_X_ )}

be more accurately identified by MARS.

1 2 _n_

(11)

## Feature relative importance

A sensitive study is typically conducted to investigate the influence of each design parameter on the design objectives (e.g., Zhang et al. [2024](#_bookmark71)). However, quantifying the contri- bution of each design parameter to the design objectives is challenging, especially when high-dimension design prob- lems are faced with routine design optimization. There- fore, the selection of the design parameters heavily relies on understanding the design problem and engineering

where ΔGCV(_X<sub>i</sub>_) indicates the increase in GCV after remov- ing the variable _X<sub>i</sub>_.

As illustrated in Fig. [14](#_bookmark22), the cone apex angle (_α_) is the most critical factor for total power consumption in Stage 1. The anchor height (_H_) and anchor shape (_b_) do not influ- ence the total power consumption. Therefore, these two design parameters are dropped in the built MARS model \[see Eq. ([8](#_bookmark9))\]. It should be noted that another design objec- tive in terms of the construction cost is also a function of _b_ and _H_ in Stage 1. As such, a further study needs to be carried out to determine if _b_ and _H_ should be dropped in Stage 1. In Stage 2, the drilling effectiveness and drilling

**Fig. 13** Comparison of the most optimal controlling strategy design from calculated data and that from the MARS model in Stage 1

**Fig. 14** The relative importance of input parameters to different design objectives

efficiency are primarily influenced by the downward velocity and the rotation velocity. The expansion velocity is the least influential, which aligns with results from sensitive studies (Zhang et al. [2024](#_bookmark71)). This is because the design objectives in Stage 2 (i.e., drilling effectiveness **_E_**<sub>1</sub> and drilling efficiency **_E_**<sub>2</sub>) are functions of power consumption in each stage \[see Eqs. ([A6](#_bookmark24)–[A8](#_bookmark25))\]. **_E_**<sub>1</sub> and **_E_**<sub>2</sub> are only sensitive to those design parameters that can induce large variations of power con- sumption (e.g., downward velocity _V_<sub>D</sub>, rotation velocity _V_<sub>R</sub>) during the drilling process. However, the portion of power consumption induced by high or low expansion velocity to total power consumption only varies from about 0.3% to 4% for all the designs involved. Therefore, the expansion veloc- ity is the least influential design parameter in Stage 2. The expansion velocity can be excluded from future bio-inspired drilling design optimizations. Therefore, the feature rela- tive importance can aid in selecting design parameters and simplifying the design optimization problem. The insights from feature relative importance analysis are not attainable through the traditional design optimization method (Zhang et al. [2024](#_bookmark71)), which cannot directly assess the relative influ- ence of design parameters.

# Conclusion

This paper proposed an adaptively updating two-stage multi-objective design optimization framework for a bio- inspired drill into the lunar regolith. Both the geometry parameters (i.e., anchor height, anchor shape, and cone apex angle) and the controlling strategies (i.e., down- ward velocity, rotation velocity, expansion velocity, and anchor-cone distance) are optimized. Different from the traditional design optimization framework, the initial lim- ited design combinations based on engineering experience are used to train MARS instead of directly being used for optimization. The design objectives in the entire design space will be predicted by MARS. Then the knee point from the whole design space is iteratively added to update the MARS models and the Pareto front, resulting in an accurate optimal design with less computational burden. Based on the results presented, the conclusions are drawn as follows.

1.  The design objectives in two stages (i.e., the construc- tion cost and the total power consumption in Stage 1, and the drilling effectiveness and the drilling efficiency in Stage 2) are accurately predicted by MARS, yielding a very high _R_<sup>2</sup> and a very low RMSE.
2.  MARS significantly reduces the large number of design combinations required to capture the design objectives across the whole design space, resulting in a more effi- cient design optimization process.
3.  MARS can yield a more accurate optimal design than that from the traditional design optimization framework since MARS can identify more non-dominant designs closer to Utopia Design and generate a more accurate Pareto front with more non-dominant designs. The accurate Pareto front from MARS ensures a reliable predicted knee point (i.e., the optimal design). This iterative updating process also decreases reliance on engineering experience for selecting initial design com- binations.
4.  MARS can quantify the contribution of each design parameter to the design objectives based on feature relative importance analysis. This additional informa- tion can identify the influential design parameters and trim down the unimportant design parameters, which will largely simplify the design optimization process. The expansion velocity can be dropped based on the feature relative importance analysis for the bio-inspired drill design.

Although only one surrogate model (i.e., MARS) and one bio-inspired concept are included in this study, this adaptively updating multi-objective optimization frame- work can be directly extended to use other surrogate mod- els (e.g., Genetic Algorithms, Support Vector Machines, and Convolutional Neural Networks) and bio-inspired concepts (e.g., snake skin-inspired drilling and tree root- inspired drilling). In addition, the current model is an ini- tial step toward a fully optimized self-penetration robot model. In the future, more complex geometries (e.g., screw threads) can be considered to realize a practical lunar drill. The proposed adaptively updating multi-objective optimi- zation design framework provides an efficient solution for the design of a bio-inspired drill into the lunar regolith, which can also serve as a guide for the design of bio- inspired tools and technologies for other extraterrestrial bodies.

# Appendix: Equations for bio‑inspired drilling performances in two‑stage multi‑objective design optimization framework

The drilling performance metrics, including construction cost **_C_** and total power consumption **_W_** in Stage 1, as well as drill- ing effectiveness **_E_**<sub>1</sub> and drilling efficiency **_E_**<sub>2</sub> in Stage 2, can

be determined following Zhang et al. ([2024](#_bookmark71)). The construction

cost **_C_** is defined as the surface area of the drill while the total

_W_Traditional = _W_Traditional

power consumption **_W_** is calculated by the summation of the P

power consumptions phase by phase, which are formulated as:

_C_ \= _M_total ⋅ (_C_manufactural + _C_transportation)

\= (_M_shaft + _M_cone + _M_anchor) ⋅ (_C_manufactural + _C_transportation)

\= (_S_shaft + _S_cone + _S_anchor) ⋅ _D_thickness ⋅ _p_ ⋅ (_C_manufactural + _C_transportation)

(A1)

Total

\= _J Q_cd_s_ \+ _J Q_sd_s_

\= _J Q_c ⋅ _V_Dd_t_ \+ _J Q_s ⋅ _V_Dd_t_

\= _V_D _J_ (_Q_c+_Q_s)d_t_

(A6)

_W_1 = _W_P1 + _W_R1

(A2a)

Δ_P_

_E_ \= Penetration

1 _P_Traditional

_W_ \= _J Q_ d_s_ \+ _J Q_ d_s_

Penetration

P1 c s

\= _J Q_c ⋅ _V_Dd_t_ \+ _J Q_s ⋅ _V_Dd_t_

_P_Traditional − _P_Clam - inspired

\= Penetration Penetration

_P_Traditional

Penetration

_W_Traditional − (_W_P1 + _W_P3)

P

\= _V_D _J_ (_Q_c+_Q_s)d_t_

_V V л_

(A2b)

\= _W_Traditional P

Δ_P_

(A7)

_W_ \= _J T_ d_ϴ_ \= _J T_ ⋅ <sup>R</sup> ⋅ 2_л_d_t_ \= <sup>R</sup> _J T_ d_t_

(A2c)

_E_ \= Penetration

R1 z

<sup>z</sup> 60

30 <sup>z</sup>

2 _P_

Additional

Δ_P_

\= Penetration

_W_ \= _W_<sup>Anchor</sup> = _J F_ d_r_ \= _J F_ ⋅ _V_

⋅ _r_d_t_ \= 1 _D_

⋅ _V J F_ d_t_

_P_Clam - inspired − _P_Clam - inspired

2 AE

r r E

2 shaft E r

Total

Penetration

_W_3 = _W_P3

\+ _W_R3

Anchor SP

\+ _W_

(A3)

(A4a)

_W_Traditional − (_W_P1 + _W_P3)

\= P

_W_ − (_W_P1 + _W_P3)

(A8)

_W_P3 = _J Q_cd_s_ \+ _J Q_sd_s_

\= _J Q_c ⋅ _V_Dd_t_ \+ _J Q_s ⋅ _V_Dd_t_

\= _V_D _J_ (_Q_c+_Q_s)d_t_

_W_ \= _V_R_л T_ d_t_

R3 _J_ z

30

_W_<sup>Anchor</sup> = _J F_cd_s_ \+ _J F_sd_s_

SP

(A4b)

(A4c)

**Acknowledgments** The first author wants to acknowledge the sup- port from the ASTRO Fellowship (formerly known as SRIDE Fel- lowship) for Exploration awarded by University of Cincinnati Arm- strong Institute for Space, Technology, and Research (ASTRO). The last author wants to acknowledge the support from the National Aero- nautics and Space Administration under Cooperative Agreement # 80NSSC23M0198. The results and opinions expressed in this paper do not necessarily reflect the views and policies of the funding agencies.

**Author contributions** Liang Zhang: methodology, software, visualiza- tion, writing—original draft. Yuxin Yuan: validation, writing—review & editing. Jiajie Cheng: writing—review & editing. Lei Wang: con- ceptualization, methodology, writing—review & editing, supervision, funding acquisition.

## Declarations

\= _J F_c ⋅ _V_Dd_t_ \+ _J_

\= _V_D _J_ (_F_c + _F_s)d_t_

_W_ \= _W_1 + _W_2 + _W_3

_F_s ⋅ _V_Dd_t_

(A4d)

(A5)

**Conflict of interest** The authors declare that they have no known com- peting financial interests or personal relationships that could have ap- peared to influence the work reported in this paper.

**Replication of results** Some or all data, models, or codes that support the findings of this study are available from the corresponding author upon reasonable request.

The drilling effectiveness **_E_**<sub>1</sub> and drilling efficiency **_E_**<sub>2</sub> can be defined as the improvement to the traditional drill with total power consumption _W_<sup>Traditional</sup>, which can

P

# References

be formulated as:

Bardhan A, Gokceoglu C, Burman A, Samui P, Asteris PG (2021) Efficient computational techniques for predicting the California

bearing ratio of soil in soaked conditions. Eng Geol 291:106239. https://doi.org/10.1016/j.enggeo.2021.106239

Changli H, Wang G, Chen G, Huang B (2015) Surrogate model-based optimization for the headform design of an axisymmetric body. Ocean Eng 107:237–245. [https://doi.org/10.1016/j.oceaneng.](https://doi.org/10.1016/j.oceaneng.2015.07.034) [2015.07.034](https://doi.org/10.1016/j.oceaneng.2015.07.034)

Chen Y, Khosravi A, Martinez A, DeJong J (2021) Modeling the self- penetration process of a bio-inspired probe in granular soils. Bioinspir Biomim 16(4):046012. [https://doi.org/10.1088/1748-](https://doi.org/10.1088/1748-3190/abf46e) [3190/abf46e](https://doi.org/10.1088/1748-3190/abf46e)

Chen Y, Martinez A, DeJong J (2022a) DEM simulations of a bio- inspired site characterization probe with two anchors. Acta Geo- tech. https://doi.org/10.1007/s11440-022-01684-5

Chen Y, Martinez A, DeJong J (2022b) DEM study of the altera- tion of the stress state in granular media around a bio-inspired probe. Can Geotech J 59(10):1691–1711. [https://doi.org/10.1139/](https://doi.org/10.1139/cgj-2021-0260) [cgj-2021-0260](https://doi.org/10.1139/cgj-2021-0260)

Chen L, Zhang W, Paneiro G, He Y, Hong L (2024) Efficient numer- ical-simulation-based slope reliability analysis considering spa- tial variability. Acta Geotech 19(5):2691–2713. [https://doi.org/10.](https://doi.org/10.1007/s11440-023-02138-2) [1007/s11440-023-02138-2](https://doi.org/10.1007/s11440-023-02138-2)

Deb K, Pratap A, Agarwal S, Meyarivan TAMT (2002) A fast and elitist multiobjective genetic algorithm: NSGA-II. IEEE Trans Evol Comput 6(2):182–197. https://doi.org/10.1109/4235.996017 Friedman JH (1991) Multivariate adaptive regression splines. Ann Stat

19(1):1–67. https://doi.org/10.1214/aos/1176347963

Goh ATC, Zhang W, Zhang Y, Xiao Y, Xiang Y (2018) Determina- tion of earth pressure balance tunnel-related maximum surface settlement: a multivariate adaptive regression splines approach. Bull Eng Geol Environ 77:489–500. [https://doi.org/10.1007/](https://doi.org/10.1007/s10064-016-0937-8) [s10064-016-0937-8](https://doi.org/10.1007/s10064-016-0937-8)

Gong W, Juang CH, Khoshnevisan S, Phoon KK (2016) R-LRFD: Load and resistance factor design considering robustness. Comput Geo- tech 74:74–87. https://doi.org/10.1016/j.compgeo.2015.12.017

Gong W, Tang H, Juang CH, Wang L (2020) Optimization design of stabilizing piles in slopes considering spatial variability. Acta Geo- tech 15:3243–3259. https://doi.org/10.1007/s11440-020-00960-6

Hu Y, Ji J, Sun Z, Dias D (2023) First order reliability-based design optimization of 3D pile-reinforced slopes with Pareto optimality. Comput Geotech 162:105635. [https://doi.org/10.1016/j.compgeo.](https://doi.org/10.1016/j.compgeo.2023.105635) [2023.105635](https://doi.org/10.1016/j.compgeo.2023.105635)

Huang S, Tao J (2020a) Bio-inspired dual-anchor burrowing: effect of vertical curvature of the shell. GeoCongress. [https://doi.org/10.](https://doi.org/10.1061/9780784482834.031) [1061/9780784482834.031](https://doi.org/10.1061/9780784482834.031)

Huang S, Tao J (2020b) Modeling clam-inspired burrowing in dry sand using cavity expansion theory and DEM. Acta Geotech 15(8):2305–2326. https://doi.org/10.1007/s11440-020-00918-8

Huang Y, He Z, Yashima A, Chen Z, Li C (2022) Multi-objective optimization design of pile-anchor structures for slopes based on reliability theory considering the spatial variability of soil prop- erties. Comput Geotech 147:104751. [https://doi.org/10.1016/j.](https://doi.org/10.1016/j.compgeo.2022.104751) [compgeo.2022.104751](https://doi.org/10.1016/j.compgeo.2022.104751)

Hunt OM, O’Hara KB, Chen Y, Martinez A (2023) Numerical and physical modeling of the effect of the cone apex angle on the penetration resistance in coarse-grained soils. Int J Geomech 23(2):04022273. [https://doi.org/10.1061/(ASCE)GM.1943-5622.](https://doi.org/10.1061/%28ASCE%29GM.1943-5622.0002626)

[0002626](https://doi.org/10.1061/%28ASCE%29GM.1943-5622.0002626)

ICG (Itasca Consulting Group) (2022) PFC—Particle flow code docu- mentation, version 7.0. Itasca Consulting Group Inc., Minneapolis Jayathilake BACS, Ilankoon IMSK, Dushyantha MNP (2022) Assess- ment of significant geotechnical parameters for lunar regolith excavations. Acta Astronaut 196:107–122. [https://doi.org/10.](https://doi.org/10.1016/j.actaastro.2022.04.008)

[1016/j.actaastro.2022.04.008](https://doi.org/10.1016/j.actaastro.2022.04.008)

Keawsawasvong S, Kounlavong K, Duong NT, Lai VQ, Khatri VN, Eskandarinejad A (2024) Seismic stability assessment of rock slopes using multivariate adaptive regression splines.

Transp Infrastruct Geotechnol. [https://doi.org/10.1007/](https://doi.org/10.1007/s40515-024-00374-x) [s40515-024-00374-x](https://doi.org/10.1007/s40515-024-00374-x)

Kotti M, González-Echevarría R, Fernández FV, Roca E, Sieiro J, Castro-López R, Fakhfakh M, López-Villegas JM (2014) Genera- tion of surrogate models of Pareto-optimal performance trade-offs of planar inductors. Analog Integr Circ Sig Process 78:87–97. https://doi.org/10.1007/s10470-013-0230-8

Li Z, Gong W, Zhang L, Wang L (2022) Multi-objective probabilistic back analysis for selecting the optimal updating strategy based on multi-source observations. Comput Geotech 151:104959. [https://](https://doi.org/10.1016/j.compgeo.2022.104959) [doi.org/10.1016/j.compgeo.2022.104959](https://doi.org/10.1016/j.compgeo.2022.104959)

Li S, Zhou D, Pan A (2024) Integrated lightweight optimization design of wall thickness, material, and performance of automobile body side structure. Struct Multidisc Optim 67(6):95. [https://doi.org/](https://doi.org/10.1007/s00158-024-03810-1) [10.1007/s00158-024-03810-1](https://doi.org/10.1007/s00158-024-03810-1)

Luat NV, Nguyen VQ, Lee S, Woo S, Lee K (2020) An evolutionary hybrid optimization of MARS model in predicting settlement of shallow foundations on sandy soils. Geomech Eng 21(6):583–598. https://doi.org/10.12989/gae.2020.21.6.583

Martinez A, DeJong J, Akin I, Aleali A, Arson C, Atkinson J, Bandini P, Baser T, Borela R, Boulanger R, Burrall M, Chen Y, Collins C, Cortes D, Dai S, DeJong T, Del Dottore E, Dorgan K, Fragaszy R, Frost JD, Full R, Ghayoomi M, Goldman DI, Gravish N, Guzman IL, Hambleton J, Hawkes E, Helms M, Hu D, Huang L, Huang S, Hunt C, Irschick D, Lin HT, Lingwall B, Marr A, Mazzolai B, McInroe B, Murthy T, O’Hara K, Porter M, Sadek S, Sanchez M, Santamarina C, Shao L, Sharp J, Stuart H, Stutz HH, Summers A, Tao J, Tolley M, Treers L, Turnbull K, Valdes R, Van Paassen L, Viggiani G, Wilson D, Wu W, Yu X, Zheng J (2022) Bio-inspired geotechnical engineering: principles, current work, opportunities and challenges. Géotechnique 72(8):687–705. [https://doi.org/10.](https://doi.org/10.1680/jgeot.20.P.170) [1680/jgeot.20.P.170](https://doi.org/10.1680/jgeot.20.P.170)

Qi X, Wang H, Pan X, Chu J, Chiam K (2021) Prediction of interfaces of geological formations using the multivariate adaptive regres- sion spline method. Undergr Space 6(3):252–266. [https://doi.org/](https://doi.org/10.1016/j.undsp.2020.02.006) [10.1016/j.undsp.2020.02.006](https://doi.org/10.1016/j.undsp.2020.02.006)

Shiau J, Keawsawasvong S (2023) Multivariate adaptive regression splines analysis for 3D slope stability in anisotropic and heterog- enous clay. J Rock Mech Geotech Eng 15(4):1052–1064. [https://](https://doi.org/10.1016/j.jrmge.2022.05.016) [doi.org/10.1016/j.jrmge.2022.05.016](https://doi.org/10.1016/j.jrmge.2022.05.016)

Tang Y, Tao J (2022) Multiscale analysis of rotational penetration in shallow dry sand and implications for self-burrowing robot design. Acta Geotech 17(10):4233–4252. [https://doi.org/10.1007/](https://doi.org/10.1007/s11440-022-01492-x) [s11440-022-01492-x](https://doi.org/10.1007/s11440-022-01492-x)

Tang J, Deng Z, Quan Q, Jiang S (2016) Real-time drilling strategy for planetary sampling: method and validation. J Aerosp Eng 29(5):04016033. [https://doi.org/10.1061/(ASCE)AS.1943-5525.](https://doi.org/10.1061/%28ASCE%29AS.1943-5525.0000619)

[0000619](https://doi.org/10.1061/%28ASCE%29AS.1943-5525.0000619)

Tang H, Gong W, Wang L, Juang CH, Martin JR, Li C (2019) Multi- objective optimization-based design of stabilizing piles in earth slopes. Int J Numer Anal Meth Geomech 43(7):1516–1536. https://doi.org/10.1002/nag.2926

Tao JJ, Huang S, Tang Y (2020) SBOR: a minimalistic soft self- burrowing-out robot inspired by razor clams. Bioinspir Biomim 15(5):055003. https://doi.org/10.1088/1748-3190/ab8754

Tian Y, Zhang J, Zhang W, Xu B, Duan Z (2022) Drill-soil penetra- tion model and its application to lunar exploration. Adv Space Res 70(11):3436–3449. https://doi.org/10.1016/j.asr.2022.07.085

Wang L, Wu C, Gu X, Liu H, Mei G, Zhang W (2020) Probabilistic stability analysis of earth dam slope under transient seepage using multivariate adaptive regression splines. Bull Eng Geol Environ 79:2763–2775. https://doi.org/10.1007/S10064-020-01730-0

Wang T, Chen W, Li T, Connolly DP, Luo Q, Liu K, Zhang W (2023) Surrogate-assisted uncertainty modeling of embankment settle- ment. Comput Geotech 159:105498. [https://doi.org/10.1016/j.](https://doi.org/10.1016/j.compgeo.2023.105498) [compgeo.2023.105498](https://doi.org/10.1016/j.compgeo.2023.105498)

Yuan Z, Zhao H, Li X, Ning Z, Wang Z, Mu R, Wang K (2024) Design and modeling of a dual-archimedes screw deep drilling system for lunar subsurface exploration. Acta Astronaut 217:221–237. https://doi.org/10.1016/j.actaastro.2024.01.046

Zhang W (2020) MARS applications in geotechnical engineering sys- tems. Springer, Singapore

Zhang T, Ding X (2017) Drilling forces model for lunar regolith explo- ration and experimental validation. Acta Astronaut 131:190–203. https://doi.org/10.1016/j.actaastro.2016.11.035

Zhang W, Goh ATC (2013) Multivariate adaptive regression splines for analysis of geotechnical engineering systems. Comput Geotech 48:82–95. https://doi.org/10.1016/j.compgeo.2012.09.016

Zhang W, Goh AT (2016) Multivariate adaptive regression splines and neural network models for prediction of pile drivability. Geosci Front 7(1):45–52. https://doi.org/10.1016/j.gsf.2014.10.003

Zhang T, Zhao Z, Liu S, Li J, Ding X, Yin S, Wang G, Lai X (2016) Design and experimental performance verification of a thermal property test-bed for lunar drilling exploration. Chin J Aeronaut 29(5):1455–1468. https://doi.org/10.1016/j.cja.2016.03.008

Zhang W, Zhang Y, Goh AT (2017) Multivariate adaptive regression splines for inverse analysis of soil and wall properties in braced excavation. Tunn Undergr Space Technol 64:24–33. [https://doi.](https://doi.org/10.1016/j.tust.2017.01.009) [org/10.1016/j.tust.2017.01.009](https://doi.org/10.1016/j.tust.2017.01.009)

Zhang T, Ding X, Liu S, Xu K, Guan Y (2019a) Experimental tech- nique for the measurement of temperature generated in deep lunar regolith drilling. Int J Heat Mass Transf 129:671–680. [https://doi.](https://doi.org/10.1016/j.ijheatmasstransfer.2018.10.015) [org/10.1016/j.ijheatmasstransfer.2018.10.015](https://doi.org/10.1016/j.ijheatmasstransfer.2018.10.015)

Zhang W, Zhang R, Wang W, Zhang F, Goh ATC (2019b) A multivari- ate adaptive regression splines model for determining horizontal wall deflection envelope for braced excavations in clays. Tunn Undergr Space Technol 84:461–471. [https://doi.org/10.1016/j.](https://doi.org/10.1016/j.tust.2018.11.046) [tust.2018.11.046](https://doi.org/10.1016/j.tust.2018.11.046)

Zhang T, Chao C, Yao Z, Xu K, Zhang W, Ding X, Liu S, Zhao Z, An Y, Wang B, Yu S, Wang B, Chen H (2021) The technology of lunar regolith environment construction on Earth. Acta Astronaut 178:216–232. https://doi.org/10.1016/j.actaastro.2020.08.039

Zhang W, Xiang J, Huang R, Liu H (2023) A review of bio-inspired geotechnics-perspectives from geomaterials, geo-components, and drilling & excavation strategies. Biogeotechnics 1(3):100025. https://doi.org/10.1016/j.bgtech.2023.100025

Zhang L, Wang L, Sun Q, Badal J, Chen Q (2024) Multi-objective design optimization of clam-inspired drilling into the lunar rego- lith. Acta Geotech 19(3):1379–1396. [https://doi.org/10.1007/](https://doi.org/10.1007/s11440-023-02119-5) [s11440-023-02119-5](https://doi.org/10.1007/s11440-023-02119-5)

Zhao B, Xu L, Liu L, Han S, Long J, Liu J (2021) A novel and high- efficiency razor clam inspired burrowing robot that utilizes local- ized fluidization mechanism. In: 2021 China automation congress (CAC). IEEE, pp 1398–1403. [https://doi.org/10.1109/CAC53003.](https://doi.org/10.1109/CAC53003.2021.9728084) [2021.9728084](https://doi.org/10.1109/CAC53003.2021.9728084)

Zhou H, Xu H, Yu X, Guo Z, Zheng G, Yang X, Tian Y (2021) Evalu- ation of the bending failure of columns under an embankment loading. Int J Geomech 21(7):04021112. [https://doi.org/10.1061/](https://doi.org/10.1061/%28ASCE%29GM.1943-5622.0002057) [(ASCE)GM.1943-5622.0002057](https://doi.org/10.1061/%28ASCE%29GM.1943-5622.0002057)

**Publisher's Note** Springer Nature remains neutral with regard to jurisdictional claims in published maps and institutional affiliations.

Springer Nature or its licensor (e.g. a society or other partner) holds exclusive rights to this article under a publishing agreement with the author(s) or other rightsholder(s); author self-archiving of the accepted manuscript version of this article is solely governed by the terms of such publishing agreement and applicable law.