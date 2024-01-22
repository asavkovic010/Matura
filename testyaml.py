import yaml
import json

data = {
	'3': {
        'soba': 'kuhinja',
		'temp': [12, 23, 33],
		'hum': [12, 23, 33],
		'press': [12, 23, 33]
	},
	'24': {
        'soba': 'spalnica',
		'temp': [12, 13, 33],
		'hum': [12, 23, 33],
		'press': [12, 23, 33]
	}
}


def save_data(data):
    with open('data.yaml', 'w') as outfile:
        yaml.dump(data, outfile, default_flow_style=False)    


def load_data():
    with open("data.yaml", 'r') as stream:
        data_loaded = yaml.safe_load(stream)
    return data_loaded


def main():
    # save_data(data)
    data = load_data()
    print(data["24"])
    print(data.get("24", {}).get("hum"))
    print(json.dumps(data, indent=2))
    
    
    
    # print('start')
    # print('writing the file')
    # write()
    # print('file writen')
    # print('reading file')
    # read()
    # print('returning the read values: ')
    # print(data)
    # print('end')

if __name__ == "__main__":
    main()

# print(data == data_loaded)
# print(data_loaded)
# print(data_loaded["B"])
