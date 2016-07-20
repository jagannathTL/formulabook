json.data do
	json.array!(@units) do |unit|
	  	json.id unit.id
	  	json.property_id unit.property_id
	    json.name unit.name
		json.system unit.system
		json.baseunit unit.baseunit
		json.symbol unit.symbol
		json.prefix unit.prefix
		json.extend unit.extend
		json.definition unit.definition
		json.description unit.description
		json.approx unit.approx
		json.factor unit.factor
		json.repeat unit.repeat
	end
end