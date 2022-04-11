sap.ui.define(["sap/ui/integration/Extension"], function (Extension) {
    "use strict";

    var DataExtension = Extension.extend("com.card.Card.DataExtension");

    DataExtension.prototype.getData = function () {
        return Promise.all([
            this.getPhoto(),
            this.getFullName()
        ]).then(function (aData) {
            var preparedData = {
                photo: aData[0][0].photo,
                firstName: aData[1][0].firstName,
                lastName: aData[1][0].lastName
            }
            return preparedData;
        });
    };

    DataExtension.prototype.getPhoto = function () {
        var oCard = this.getCard(),
            oParameters = oCard.getCombinedParameters();
        return oCard.request({
            "url": "{{destinations.SFSFDestination}}/Photo(photoType=12,userId='sfadmin')/photo",
            "parameters": {
                "$format": "json",
                "$top": oParameters.maxItems
            }
        }).then(function (aDataPhoto) {
            return [aDataPhoto.d].map(function (oPhoto) {
                return {
                    photo: oPhoto.photo
                };
            });
        });
    };

    DataExtension.prototype.getFullName = function () {
        var oCard = this.getCard(),
            oParameters = oCard.getCombinedParameters();
        return oCard.request({
            "url": "{{destinations.SFSFDestination}}/User('sfadmin')",
            "parameters": {
                "$format": "json",
                "$top": oParameters.maxItems
            }
        }).then(function (aDataName) {
            var name = [aDataName.d];
            return name.map(function (oName) {
                return {
                    firstName: oName.firstName,
                    lastName: oName.lastName
                };
            });
        });
    };

    return DataExtension;
});