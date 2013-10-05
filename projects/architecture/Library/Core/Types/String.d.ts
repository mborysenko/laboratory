declare module SDL.Client.Types.String
{
	function utf8encode(value?: string): string;
	function base64encode(value: string): string;
	function format(value: string, ...params: string[]): string;
	function format(value: string, params: string[]): string;
}