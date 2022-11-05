import * as discord from 'discord.js';
const hookToken = process.env.webhookToken?.replace(/^"|"$/g, '') ?? 'UNSPECIFIED-HOOK-TOKEN';
const hookID = process.env.webhookID?.replace(/^"|"$/g, '') ?? 'UNSPECIFIED-HOOK-ID';
const threadID = process.env.threadID?.replace(/^"|"$/g, '');
const gh = JSON.parse(process.env.githubENV?.replace(/^"|"$/g, '') ?? 'undefined');
if (!(gh && 'event' in gh))
    throw new Error('No `githubENV` found in environment');
//console.log(`Sending Discord update for event:\n${JSON.stringify(gh.event, null, 4)}`);
const hookOpts = discord.parseWebhookURL(`https://discord.com/api/webhooks/${hookID}/${hookToken}`);
if (!hookOpts)
    throw new Error(`Invalid webhook URL: "${hookOpts}"`);
async function getDeploymentURL() {
    try {
        const deployments = await fetch(gh.event.repository.deployments_url).then(r => r.json());
        const deployment = deployments.find(d => d.environment.toLowerCase() === 'github pages');
        if (!deployment)
            return console.warn(`No deployment found for environment "GitHub Pages"`);
        const deploymentStatuses = await fetch(deployment.statuses_url).then(r => r.json());
        return deploymentStatuses.find(s => s.state === 'success' && s.environment_url)?.environment_url ?? '';
    }
    catch (e) {
        console.warn(`Encountered error while fetching deployment URL:\n${e}`);
        return '';
    }
}
const hook = new discord.WebhookClient(hookOpts);
const deploymentURL = await getDeploymentURL();
const [, commitTitle, commitMessage] = gh.event.head_commit?.message.replace(/\r\n?/g, '\n').match(/^(.*)(?:\n+([\s\S]*))?$/) ?? ['', '< No commit message >', ''];
hook.send({
    content: `New site version!`,
    tts: false,
    embeds: [
        {
            color: Number(BigInt(`0x${gh.event.head_commit?.id ?? '0'}`) % 0xffffffn),
            title: commitTitle,
            timestamp: new Date().toISOString(),
            description: deploymentURL ? `${commitMessage}\n\nCheck it out at <${deploymentURL}>!` : commitMessage,
            provider: { name: `GitHub: ${gh.repository}`, url: gh.event.repository.html_url },
            author: {
                name: `@${gh.event.sender.login} - GitHub`,
                url: gh.event.sender.html_url,
                icon_url: gh.event.sender.avatar_url
            }
        }
    ],
    username: `GitHub - ${gh.repository} Updates`,
    avatarURL: `${gh.event.repository.owner.avatar_url}${gh.event.repository.owner.avatar_url.includes('?') ? '&' : '?'}size=256`,
    threadId: threadID
});
