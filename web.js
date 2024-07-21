const meetingCodes = {
    meetingCode1: ' ',
    meetingCode2: '',
    meetingCode3: '',
    meetingCode4: '',
    meetingCode5: '',
    meetingCode6: ''
};
function joinMeetingg(meetingCodeKey) {
    const meetingCode = meetingCodes[meetingCodeKey];
    const meetUrl = `https://meet.google.com/${meetingCode}`;
    window.open(meetUrl, '_blank');
}