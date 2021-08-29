import fetch from "node-fetch";
import { Command, CommandEvent, CommandExecutor, CommandResponse } from "../../command/command";
import { fail, get_command_manager } from "../../global";
import { Plugin } from "../plugin";

// Generated by https://quicktype.io

export interface Corona {
	objectIdFieldName: string;
	uniqueIdField:     UniqueIDField;
	globalIdFieldName: string;
	geometryType:      string;
	spatialReference:  SpatialReference;
	fields:            Field[];
	features:          Feature[];
}

export interface Feature {
	attributes: Attributes;
}

export interface Attributes {
	OBJECTID:       number;
	Country_Region: string;
	Last_Update:    number;
	Lat:            number;
	Long_:          number;
	Confirmed:      number;
	Deaths:         number;
	Recovered:      number;
	Active:         number;
}

export interface Field {
	name:         string;
	type:         string;
	alias:        string;
	sqlType:      string;
	domain:       null;
	defaultValue: null;
	length?:      number;
}

export interface SpatialReference {
	wkid:       number;
	latestWkid: number;
}

export interface UniqueIDField {
	name:               string;
	isSystemMaintained: boolean;
}


export default {
	name: "corona",
	version: "0.0.1",

	load() {
		get_command_manager().add_command(new Command("corona", "Get information about the current COVID 19 cases!", "Use '#corona [country]' to see information about the current cases!\n\nExample: \n#corona germany", {
			execute: async (event: CommandEvent): Promise<CommandResponse> => {
				if (event.interface.args.length != 1) {
					return fail;
				}

				const res = await (await fetch("https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/2/query?f=json&where=Country_Region%3D%27" + event.interface.args[0] + "%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&resultOffset=0&resultRecordCount=50&cacheHint=true")).json() as Corona;

				return {
					is_response: true,
					response: `%italic%COVID info for ${res.features[0].attributes.Country_Region}%italic%\n\nConfirmed cases: ${res.features[0].attributes.Confirmed}\nTotal deaths: ${res.features[0].attributes.Deaths}\nRecovered cases: ${res.features[0].attributes.Recovered}\nActive cases: ${res.features[0].attributes.Active}\n\nLast updated: ${new Date(res.features[0].attributes.Last_Update).toUTCString()}`
				}
			}
		} as CommandExecutor, undefined));
	},

	reload() {

	}
} as Plugin;