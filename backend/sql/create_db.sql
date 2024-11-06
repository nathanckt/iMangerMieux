/*==============================================================*/
/* Nom de SGBD :  MySQL 5.0                                     */
/* Date de cr�ation :  18/10/2024 16:26:03                      */
/*==============================================================*/


drop table if exists ALIMENT;

drop table if exists APPORT;

drop table if exists APPORTE;

drop table if exists CONTIENT;

drop table if exists EST_COMPOSE;

drop table if exists PRATIQUE_SPORTIVE;

drop table if exists REPAS;

drop table if exists SEXE;

drop table if exists TRANCHE_D_AGE;

drop table if exists TYPE_D_ALIMENT;

drop table if exists UTILISATEUR;

/*==============================================================*/
/* Table : ALIMENT                                              */
/*==============================================================*/
create table ALIMENT
(
   ID_ALIMENT           int not null AUTO_INCREMENT,
   ID_TYPE              int not null,
   LIBELLE_ALIMENT      varchar(150) not null,
   primary key (ID_ALIMENT)
);

/*==============================================================*/
/* Table : APPORT                                               */
/*==============================================================*/
create table APPORT
(
   ID_APPORT            int not null AUTO_INCREMENT,
   LIBELLE_APPORT       varchar(100) not null,
   primary key (ID_APPORT)
);

/*==============================================================*/
/* Table : APPORTE                                              */
/*==============================================================*/
create table APPORTE
(
   ID_ALIMENT           int not null ,
   ID_APPORT            int not null ,
   POURCENTAGE_APPORT   float,
   primary key (ID_ALIMENT, ID_APPORT)
);

/*==============================================================*/
/* Table : CONTIENT                                             */
/*==============================================================*/
create table CONTIENT
(
   ID_ALIMENT           int not null,
   ID_REPAS             int not null,
   QUANTITE             int,
   primary key (ID_ALIMENT, ID_REPAS)
);

/*==============================================================*/
/* Table : EST_COMPOSE                                          */
/*==============================================================*/
create table EST_COMPOSE
(
   ALI_ID_ALIMENT       int not null,
   ID_ALIMENT           int not null,
   POURCENTAGE_ALIMENT  int,
   primary key (ALI_ID_ALIMENT, ID_ALIMENT)
);

/*==============================================================*/
/* Table : PRATIQUE_SPORTIVE                                    */
/*==============================================================*/
create table PRATIQUE_SPORTIVE
(
   ID_SPORT             int not null AUTO_INCREMENT,
   LIBELLE_SPORT        varchar(50) not null,
   primary key (ID_SPORT)
);

/*==============================================================*/
/* Table : REPAS                                                */
/*==============================================================*/
create table REPAS
(
   ID_REPAS             int not null AUTO_INCREMENT,
   LOGIN                varchar(50) not null,
   DATE                 datetime not null,
   primary key (ID_REPAS)
);

/*==============================================================*/
/* Table : SEXE                                                 */
/*==============================================================*/
create table SEXE
(
   ID_SEXE              int not null AUTO_INCREMENT,
   LIBELLE_SEXE         varchar(50) not null,
   primary key (ID_SEXE)
);

/*==============================================================*/
/* Table : TRANCHE_D_AGE                                        */
/*==============================================================*/
create table TRANCHE_D_AGE
(
   ID_TRANCHE           int not null AUTO_INCREMENT,
   LIBELLE_TRANCHE      varchar(50) not null,
   primary key (ID_TRANCHE)
);

/*==============================================================*/
/* Table : TYPE_D_ALIMENT                                       */
/*==============================================================*/
create table TYPE_D_ALIMENT
(
   ID_TYPE              int not null AUTO_INCREMENT,
   LIBELLE_TYPE         varchar(50) not null,
   primary key (ID_TYPE)
);

/*==============================================================*/
/* Table : UTILISATEUR                                          */
/*==============================================================*/
create table UTILISATEUR
(
   LOGIN                varchar(50) not null,
   ID_SEXE              int not null,
   ID_TRANCHE           int not null,
   ID_SPORT             int not null,
   MOT_DE_PASSE         varchar(50) not null,
   NOM                  varchar(50) not null,
   PRENOM               varchar(50) not null,
   MAIL                 varchar(50) not null,
   DATE_DE_NAISSANCE    date not null,
   primary key (LOGIN)
);

alter table ALIMENT add constraint FK_EST foreign key (ID_TYPE)
      references TYPE_D_ALIMENT (ID_TYPE) on delete restrict on update restrict;

alter table APPORTE add constraint FK_APPORTE foreign key (ID_ALIMENT)
      references ALIMENT (ID_ALIMENT) on delete restrict on update restrict;

alter table APPORTE add constraint FK_APPORTE2 foreign key (ID_APPORT)
      references APPORT (ID_APPORT) on delete restrict on update restrict;

alter table CONTIENT add constraint FK_CONTIENT foreign key (ID_ALIMENT)
      references ALIMENT (ID_ALIMENT) on delete restrict on update restrict;

alter table CONTIENT add constraint FK_CONTIENT2 foreign key (ID_REPAS)
      references REPAS (ID_REPAS) on delete restrict on update restrict;

alter table EST_COMPOSE add constraint FK_EST_COMPOSE foreign key (ALI_ID_ALIMENT)
      references ALIMENT (ID_ALIMENT) on delete restrict on update restrict;

alter table EST_COMPOSE add constraint FK_EST_COMPOSE2 foreign key (ID_ALIMENT)
      references ALIMENT (ID_ALIMENT) on delete restrict on update restrict;

alter table REPAS add constraint FK_CONSOMME foreign key (LOGIN)
      references UTILISATEUR (LOGIN) on delete restrict on update restrict;

alter table UTILISATEUR add constraint FK_A_COMME foreign key (ID_SEXE)
      references SEXE (ID_SEXE) on delete restrict on update restrict;

alter table UTILISATEUR add constraint FK_EST_DANS foreign key (ID_TRANCHE)
      references TRANCHE_D_AGE (ID_TRANCHE) on delete restrict on update restrict;

alter table UTILISATEUR add constraint FK_PRATIQUE foreign key (ID_SPORT)
      references PRATIQUE_SPORTIVE (ID_SPORT) on delete restrict on update restrict;

INSERT INTO `SEXE` (`ID_SEXE`, `LIBELLE_SEXE`) VALUES (NULL, 'homme'), (NULL, 'femme'), (NULL, 'autre');

INSERT INTO `PRATIQUE_SPORTIVE` (`ID_SPORT`, `LIBELLE_SPORT`) VALUES (NULL, 'bas'), (NULL, 'moyen'), (NULL, 'élevé');

INSERT INTO `TRANCHE_D_AGE` (`ID_TRANCHE`, `LIBELLE_TRANCHE`) VALUES (NULL, '< 40'), (NULL, '< 60'), (NULL, '> 60');




